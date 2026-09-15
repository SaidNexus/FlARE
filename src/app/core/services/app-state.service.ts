import { Injectable, signal, computed, effect } from '@angular/core';
import { User } from '../models/user.model';
import { CartItem, Order } from '../models/order.model';
import { Product } from '../models/product.model';

export type { CartItem };

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const USER_STORAGE_KEY = 'flare-auth-user';
const FAVORITES_STORAGE_KEY = 'flare-favorites';
const THEME_STORAGE_KEY = 'flare-theme';
const LANG_STORAGE_KEY = 'flare-lang';

function isStaffRole(role?: string): boolean {
  return role === 'admin' || role === 'manager' || role === 'sales';
}

function readStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && parsed.id && parsed.role) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function readStoredFavorites(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
    return {};
  } catch {
    return {};
  }
}

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  readonly theme = signal<'light' | 'dark'>(
    (localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark') || 'light'
  );
  readonly lang = signal<'ar' | 'en'>(
    (localStorage.getItem(LANG_STORAGE_KEY) as 'ar' | 'en') || 'ar'
  );
  readonly dir = computed(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));

  readonly user = signal<User | null>(readStoredUser());
  readonly cart = signal<CartItem[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly favoritesByCustomer = signal<Record<string, string[]>>(readStoredFavorites());

  readonly unreadCount = signal<number>(2);
  readonly chatUnread = signal<number>(1);
  readonly toasts = signal<Toast[]>([]);

  readonly isAdmin = computed(() => isStaffRole(this.user()?.role));
  readonly cartCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly customerFavoritesKey = computed(() =>
    this.user()?.role === 'customer' ? (this.user()?.id as string) : 'guest'
  );

  readonly favoriteProductIds = computed(() => {
    const key = this.customerFavoritesKey();
    return this.favoritesByCustomer()[key] ?? [];
  });

  constructor() {
    // Theme effect
    effect(() => {
      const currentTheme = this.theme();
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    });

    // Lang & Dir effect
    effect(() => {
      const currentLang = this.lang();
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLang;
      localStorage.setItem(LANG_STORAGE_KEY, currentLang);
    });

    // Favorites effect
    effect(() => {
      localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(this.favoritesByCustomer())
      );
    });

    // Cross-tab storage listener
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === USER_STORAGE_KEY) {
          this.user.set(readStoredUser());
        }
      });
    }
  }

  setUser(nextUser: User | null): void {
    this.user.set(nextUser);
    if (nextUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  toggleTheme(): void {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  setLang(nextLang: 'ar' | 'en'): void {
    this.lang.set(nextLang);
  }

  addToCart(product: Product, size: string, quantity = 1): void {
    this.cart.update((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { product, size, quantity }];
    });
  }

  removeFromCart(productId: string, size: string): void {
    this.cart.update((current) =>
      current.filter(
        (item) => !(item.product.id === productId && item.size === size)
      )
    );
  }

  updateQuantity(productId: string, size: string, quantity: number): void {
    this.cart.update((current) => {
      if (quantity <= 0) {
        return current.filter(
          (item) => !(item.product.id === productId && item.size === size)
        );
      }
      return current.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      );
    });
  }

  clearCart(): void {
    this.cart.set([]);
  }

  toggleFavorite(productId: string): void {
    const key = this.customerFavoritesKey();
    this.favoritesByCustomer.update((current) => {
      const currentIds = current[key] ?? [];
      const nextIds = currentIds.includes(productId)
        ? currentIds.filter((id) => id !== productId)
        : [...currentIds, productId];
      return { ...current, [key]: nextIds };
    });
  }

  removeFavorite(productId: string): void {
    const key = this.customerFavoritesKey();
    this.favoritesByCustomer.update((current) => ({
      ...current,
      [key]: (current[key] ?? []).filter((id) => id !== productId),
    }));
  }

  clearFavorites(): void {
    const key = this.customerFavoritesKey();
    this.favoritesByCustomer.update((current) => ({ ...current, [key]: [] }));
  }

  isFavorite(productId: string): boolean {
    return this.favoriteProductIds().includes(productId);
  }

  addOrder(order: Order): void {
    this.orders.update((current) => [order, ...current]);
  }

  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success'): void {
    const id = Math.random().toString(36).slice(2);
    this.toasts.update((current) => [...current, { id, type, message }]);
    setTimeout(() => {
      this.dismissToast(id);
    }, 3500);
  }

  dismissToast(id: string): void {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }
}
