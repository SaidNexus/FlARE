import { Component, inject, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AppStateService } from '../../core/services/app-state.service';
import { StaffAccessService } from '../../core/services/staff-access.service';
import { LangService } from '../../core/services/lang/lang.service';

interface MenuItem {
  to: string;
  title: string;
  description: string;
  iconName: string;
}

interface NavLink {
  to: string;
  label: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  protected readonly appState = inject(AppStateService);
  protected readonly staffAccess = inject(StaffAccessService);
  public readonly langService = inject(LangService);
  private readonly router = inject(Router);

  readonly menuOpen = signal<boolean>(false);
  readonly menuSide = signal<'left' | 'right'>('left');

  toggleLanguage(): void {
    this.langService.toggleLang();
  }

  get desktopNavLinks(): NavLink[] {
    const isEn = this.langService.storefrontLang() === 'en';
    return [
      { to: '/', label: isEn ? 'Home' : 'الرئيسية' },
      { to: '/products', label: isEn ? 'All Products' : 'جميع المنتجات' },
      { to: '/categories', label: isEn ? 'Categories' : 'التصنيفات' },
      { to: '/offers', label: isEn ? 'Exclusive Offers' : 'العروض الحصرية' },
      { to: '/problems', label: isEn ? 'Hair Solutions' : 'علاج مشاكل الشعر' },
    ];
  }

  get shoppingMenuItems(): MenuItem[] {
    const isEn = this.langService.storefrontLang() === 'en';
    return [
      { to: '/', title: isEn ? 'Home' : 'الرئيسية', description: isEn ? 'Back to homepage' : 'العودة إلى الصفحة الرئيسية', iconName: 'home' },
      { to: '/categories', title: isEn ? 'Categories' : 'التصنيفات', description: isEn ? 'Browse by category' : 'تصفح المنتجات حسب الفئة', iconName: 'grid' },
      { to: '/products', title: isEn ? 'All Products' : 'كل المنتجات', description: isEn ? 'Browse all products' : 'استعرض جميع المنتجات المتاحة', iconName: 'shopping-bag' },
      { to: '/favorites', title: isEn ? 'Wishlist' : 'المفضلة', description: isEn ? 'Your saved favorites' : 'المنتجات التي قمت بحفظها', iconName: 'heart' },
      { to: '/cart', title: isEn ? 'Shopping Cart' : 'سلة التسوق', description: isEn ? 'Review items & checkout' : 'راجع منتجاتك وأكمل الطلب', iconName: 'shopping-cart' },
    ];
  }

  get helpMenuItems(): MenuItem[] {
    const isEn = this.langService.storefrontLang() === 'en';
    return [
      { to: '/orders', title: isEn ? 'Track Order' : 'تتبع الطلب', description: isEn ? 'Track order status live' : 'تابع حالة طلبك لحظة بلحظة', iconName: 'package' },
      { to: '/faq', title: isEn ? 'FAQ' : 'الأسئلة الشائعة', description: isEn ? 'Frequently asked questions' : 'إجابات لأكثر الأسئلة شيوعًا', iconName: 'help' },
      { to: '/policies', title: isEn ? 'Store Policies' : 'السياسات والمعلومات', description: isEn ? 'Shipping, returns and privacy' : 'تعرف على سياسات المتجر والشحن والاستبدال والخصوصية', iconName: 'shield' },
      { to: '/about', title: isEn ? 'About Us' : 'من نحن', description: isEn ? 'Our story and values' : 'معلومات عن متجر FLARE', iconName: 'file' },
      { to: '/profile', title: isEn ? 'My Account' : 'حسابي', description: isEn ? 'Manage orders & profile' : 'إدارة بياناتك وطلباتك', iconName: 'user' },
    ];
  }

  constructor() {
    effect(() => {
      if (typeof document !== 'undefined') {
        if (this.menuOpen()) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.menuOpen()) {
      this.closeMenu();
    }
  }

  openMenu(side?: 'left' | 'right'): void {
    if (side) {
      this.menuSide.set(side);
    } else {
      this.menuSide.set(this.langService.storefrontLang() === 'ar' ? 'right' : 'left');
    }
    this.menuOpen.set(true);
  }

  openMobileMenu(): void {
    this.openMenu(this.langService.storefrontLang() === 'ar' ? 'right' : 'left');
  }

  openDesktopMenu(): void {
    this.openMenu(this.langService.storefrontLang() === 'ar' ? 'left' : 'right');
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  get showStaffItem(): boolean {
    return this.appState.isAdmin() || this.staffAccess.isKnownStaffDevice();
  }

  get staffDestination(): string {
    return this.appState.isAdmin() ? '/admin/orders' : '/admin/login';
  }
}
