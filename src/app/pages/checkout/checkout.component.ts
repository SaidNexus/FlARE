import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AppStateService, CartItem } from '../../core/services/app-state.service';
import { OrderService } from '../../core/services/order.service';
import { OrderTrackingService } from '../../core/services/order-tracking.service';
import { WalletPaymentFlowComponent, WalletPaymentSession } from './components/wallet-payment-flow/wallet-payment-flow.component';
import { CheckoutPageConfigService } from '../../core/services/page-configs/checkout-page-config.service';
import { LangService } from '../../core/services/lang.service';

const WALLET_PAYMENT_SESSION_KEY = 'lk-wallet-payment-session';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, WalletPaymentFlowComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  protected readonly appState = inject(AppStateService);
  private readonly orderService = inject(OrderService);
  private readonly orderTrackingService = inject(OrderTrackingService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly configService = inject(CheckoutPageConfigService);
  private readonly langService = inject(LangService);

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');
  readonly currencyLabel = computed(() => this.isEn() ? 'SAR' : 'ر.س');

  readonly config = this.configService.pageConfig;

  readonly headerTitle = computed(() => (this.isEn() ? this.config().headerTitleEn : this.config().headerTitleAr) || this.config().headerTitle);
  readonly headerSubtitle = computed(() => (this.isEn() ? this.config().headerSubtitleEn : this.config().headerSubtitleAr) || this.config().headerSubtitle);
  readonly customerInfoTitle = computed(() => (this.isEn() ? this.config().customerInfoTitleEn : this.config().customerInfoTitleAr) || this.config().customerInfoTitle);
  readonly paymentInfoTitle = computed(() => (this.isEn() ? this.config().paymentInfoTitleEn : this.config().paymentInfoTitleAr) || this.config().paymentInfoTitle);
  readonly summaryTitle = computed(() => (this.isEn() ? this.config().summaryTitleEn : this.config().summaryTitleAr) || this.config().summaryTitle);
  readonly safeShoppingTitle = computed(() => (this.isEn() ? this.config().safeShoppingTitleEn : this.config().safeShoppingTitleAr) || this.config().safeShoppingTitle);
  readonly safeShoppingText = computed(() => (this.isEn() ? this.config().safeShoppingTextEn : this.config().safeShoppingTextAr) || this.config().safeShoppingText);
  readonly emptyStateTitle = computed(() => (this.isEn() ? this.config().emptyStateTitleEn : this.config().emptyStateTitleAr) || this.config().emptyStateTitle);
  readonly emptyStateText = computed(() => (this.isEn() ? this.config().emptyStateTextEn : this.config().emptyStateTextAr) || this.config().emptyStateText);
  readonly emptyStateCta = computed(() => (this.isEn() ? this.config().emptyStateCtaEn : this.config().emptyStateCtaAr) || this.config().emptyStateCta);

  readonly fullName = signal<string>('');
  readonly phone = signal<string>('');
  readonly city = signal<string>('');
  readonly area = signal<string>('');
  readonly address = signal<string>('');
  readonly notes = signal<string>('');

  readonly paymentMethod = signal<'cod' | 'bank' | 'wallet'>('cod');
  readonly walletProvider = signal<'stc' | 'mada' | 'apple' | 'google'>('stc');

  readonly bankReceipt = signal<File | null>(null);

  readonly isWalletFlow = signal<boolean>(false);
  readonly walletSession = signal<WalletPaymentSession | null>(null);

  readonly cityOptions = computed(() => this.isEn() 
    ? ['Riyadh', 'Jeddah', 'Dammam', 'Madinah'] 
    : ['الرياض', 'جدة', 'الدمام', 'المدينة']);

  readonly areaOptions = computed(() => this.isEn() 
    ? ['North', 'South', 'East', 'West', 'Central'] 
    : ['شمال', 'جنوب', 'شرق', 'غرب', 'وسط']);

  readonly walletOptions = computed<Array<{ id: 'stc' | 'mada' | 'apple' | 'google'; label: string }>>(() => [
    { id: 'stc', label: 'STC Pay' },
    { id: 'mada', label: this.isEn() ? 'Mada' : 'مدى' },
    { id: 'apple', label: 'Apple Pay' },
    { id: 'google', label: 'Google Pay' },
  ]);

  readonly subtotal = computed(() => {
    return this.appState.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  });

  readonly shipping = computed(() => {
    return this.appState.cart().length > 0 ? 20 : 0;
  });

  readonly total = computed(() => {
    return Math.max(0, this.subtotal() + this.shipping());
  });

  readonly itemCount = computed(() => {
    return this.appState.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  ngOnInit(): void {
    const user = this.appState.user();
    if (user) {
      this.fullName.set(user.name || '');
      this.phone.set(user.phone || '');
    }

    this.route.queryParamMap.subscribe((params) => {
      if (params.get('payment') === 'wallet') {
        try {
          const raw = sessionStorage.getItem(WALLET_PAYMENT_SESSION_KEY);
          if (raw) {
            this.walletSession.set(JSON.parse(raw));
            this.isWalletFlow.set(true);
          }
        } catch {}
      } else {
        this.isWalletFlow.set(false);
      }
    });
  }

  handleBankReceiptSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.appState.showToast(this.isEn() ? 'Bank receipt must not exceed 5MB' : 'حجم إيصال التحويل يجب ألا يتجاوز 5MB', 'warning');
        return;
      }
      this.bankReceipt.set(file);
      this.appState.showToast(this.isEn() ? 'Bank receipt attached' : 'تم إرفاق إيصال التحويل', 'success');
    }
  }

  hasRequiredData(): boolean {
    return Boolean(this.fullName().trim() && this.phone().trim() && this.address().trim());
  }

  startWalletPayment(): void {
    if (!this.hasRequiredData()) {
      this.appState.showToast(this.isEn() ? 'Please fill in all required fields' : 'من فضلك أدخلي جميع البيانات المطلوبة', 'warning');
      return;
    }

    const session: WalletPaymentSession = {
      orderId: this.orderTrackingService.createTrackedOrderId(),
      orderNumber: `FLR${Date.now().toString().slice(-9)}`,
      createdAt: new Date().toISOString(),
      provider: this.walletProvider(),
      items: this.appState.cart().map((item) => ({
        productId: item.product.id,
        name: (this.isEn() ? item.product.nameEn : item.product.nameAr) || item.product.nameAr,
        image: item.product.images?.[0] || '',
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.product.price
      })),
      subtotal: this.subtotal(),
      shipping: this.shipping(),
      discount: 0,
      total: this.total(),
      customerName: this.fullName().trim(),
      phone: this.phone().trim(),
      city: this.city(),
      area: this.area(),
      address: this.address().trim(),
      notes: this.notes().trim(),
      country: this.isEn() ? 'Saudi Arabia' : 'السعودية'
    };

    try {
      sessionStorage.setItem(WALLET_PAYMENT_SESSION_KEY, JSON.stringify(session));
    } catch {}

    this.walletSession.set(session);
    this.isWalletFlow.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onWalletBack(): void {
    this.isWalletFlow.set(false);
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onWalletComplete(): void {
    this.appState.clearCart();
    sessionStorage.removeItem(WALLET_PAYMENT_SESSION_KEY);
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (this.paymentMethod() === 'wallet') {
      this.startWalletPayment();
      return;
    }

    if (!this.hasRequiredData()) {
      this.appState.showToast(this.isEn() ? 'Please fill in all required fields' : 'من فضلك أدخلي جميع البيانات المطلوبة', 'warning');
      return;
    }

    if (this.paymentMethod() === 'bank' && !this.bankReceipt()) {
      this.appState.showToast(this.isEn() ? 'Please attach the bank transfer receipt' : 'من فضلك أرفقي إيصال التحويل البنكي', 'warning');
      return;
    }

    const orderData = {
      items: this.appState.cart().map((item) => ({
        productId: item.product.id,
        productName: (this.isEn() ? item.product.nameEn : item.product.nameAr) || item.product.nameAr,
        size: item.size,
        price: item.product.price,
        quantity: item.quantity
      })),
      total: this.total(),
      customerInfo: {
        fullName: this.fullName().trim(),
        phone: this.phone().trim(),
        address: this.address().trim(),
        city: this.city()
      },
      paymentMethod: this.paymentMethod() === 'bank'
        ? (this.isEn() ? 'Bank Transfer' : 'تحويل بنكي')
        : (this.isEn() ? 'Cash on Delivery' : 'دفع عند الاستلام')
    };

    this.orderService.placeOrder(orderData as any).then((order) => {
      this.appState.showToast(this.isEn() ? 'Order confirmed successfully' : 'تم تأكيد الطلب بنجاح', 'success');
      this.appState.clearCart();
      this.router.navigate(['/order-confirmation'], { state: { order } });
    }).catch(() => {
      this.appState.showToast(this.isEn() ? 'Could not save order' : 'تعذر حفظ الطلب', 'error');
    });
  }

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
}
