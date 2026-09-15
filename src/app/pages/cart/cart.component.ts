import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppStateService, CartItem } from '../../core/services/app-state.service';
import { LangService } from '../../core/services/lang/lang.service';
import { CartPageConfigService } from '../../core/services/page-configs/cart-page-config.service';

interface ResolvedCartItem {
  cartItem: CartItem;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  volume: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  protected readonly appState = inject(AppStateService);
  protected readonly langService = inject(LangService);
  private readonly router = inject(Router);
  private readonly configService = inject(CartPageConfigService);
  readonly config = this.configService.pageConfig;

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');
  readonly currencyLabel = computed(() => (this.isEn() ? 'SAR' : 'ر.س'));

  readonly couponCode = signal<string>('');
  readonly appliedCoupon = signal<string | null>(null);

  getItemImage(product: any): string {
    const raw = (product?.images && product.images[0]) || product?.image || '';
    if (!raw) return '/assets/images/products/shampoo/shampoo-dandruff.png';
    return raw.startsWith('/') || raw.startsWith('http') || raw.startsWith('data:') ? raw : '/' + raw;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('/assets/images/products/shampoo/shampoo-dandruff.png')) {
      target.src = '/assets/images/products/shampoo/shampoo-dandruff.png';
    }
  }

  readonly displayItems = computed<ResolvedCartItem[]>(() => {
    const en = this.isEn();
    return this.appState.cart().map((item) => ({
      cartItem: item,
      name: en ? (item.product.nameEn || item.product.nameAr) : item.product.nameAr,
      image: this.getItemImage(item.product),
      price: Math.round(item.product.price),
      oldPrice: item.product.originalPrice ? Math.round(item.product.originalPrice) : undefined,
      volume: item.size || '',
    }));
  });

  readonly subtotal = computed(() => {
    return this.displayItems().reduce((sum, item) => sum + item.price * item.cartItem.quantity, 0);
  });

  readonly shipping = computed(() => {
    return this.displayItems().length > 0 ? 20 : 0;
  });

  readonly discount = computed(() => {
    if (this.appliedCoupon() === 'FLARE10') {
      return Math.round(this.subtotal() * 0.1);
    }
    return 0;
  });

  readonly total = computed(() => {
    return Math.max(0, this.subtotal() + this.shipping() - this.discount());
  });

  readonly itemCount = computed(() => {
    return this.appState.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  applyCoupon(): void {
    const code = this.couponCode().trim().toUpperCase();
    if (!code) {
      this.appState.showToast(this.isEn() ? 'Please enter a coupon code first' : 'اكتبي كود الخصم أولًا', 'warning');
      return;
    }

    if (code === 'FLARE10') {
      this.appliedCoupon.set(code);
      this.appState.showToast(this.isEn() ? 'Coupon applied successfully!' : 'تم تطبيق كود الخصم بنجاح');
      return;
    }

    this.appliedCoupon.set(null);
    this.appState.showToast(this.isEn() ? 'Invalid coupon code' : 'كود الخصم غير صحيح', 'error');
  }

  updateQty(productId: string, size: string, newQty: number): void {
    this.appState.updateQuantity(productId, size, newQty);
  }

  removeItem(productId: string, size: string): void {
    this.appState.removeFromCart(productId, size);
    this.appState.showToast(this.isEn() ? 'Product removed from cart' : 'تم حذف المنتج من السلة', 'info');
  }

  toggleFav(productId: string): void {
    const isFav = this.appState.isFavorite(productId);
    this.appState.toggleFavorite(productId);
    const msg = isFav
      ? (this.isEn() ? 'Removed from favorites' : 'تم حذف المنتج من المفضلة')
      : (this.isEn() ? 'Added to favorites' : 'تمت إضافة المنتج إلى المفضلة');
    this.appState.showToast(msg, 'info');
  }

  proceedToCheckout(): void {
    this.router.navigateByUrl('/checkout');
  }
}
