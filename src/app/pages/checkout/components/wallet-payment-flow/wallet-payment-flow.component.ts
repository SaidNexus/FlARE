import { Component, input, output, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderTrackingService } from '../../../../core/services/order-tracking.service';
import { LangService } from '../../../../core/services/lang.service';

export interface WalletPaymentSession {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  provider: 'stc' | 'mada' | 'apple' | 'google';
  items: Array<{
    productId: string;
    name: string;
    image: string;
    size?: string;
    color?: string;
    volume?: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  customerName: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  notes?: string;
  country: string;
  deliveryCompany?: string;
}

export const WALLET_PROVIDER_LABELS: Record<string, string> = {
  stc: 'STC Pay',
  mada: 'مدى',
  apple: 'Apple Pay',
  google: 'Google Pay'
};

@Component({
  selector: 'app-wallet-payment-flow',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-payment-flow.component.html',
  styleUrl: './wallet-payment-flow.component.css'
})
export class WalletPaymentFlowComponent {
  readonly session = input.required<WalletPaymentSession>();
  readonly back = output<void>();
  readonly complete = output<void>();

  private readonly router = inject(Router);
  private readonly orderTrackingService = inject(OrderTrackingService);
  private readonly langService = inject(LangService);

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');

  readonly step = signal<number>(1);
  readonly maxUnlockedStep = signal<number>(1);
  readonly flashingStep = signal<number | null>(null);

  readonly cardNumber = signal<string>('');
  readonly expiryDate = signal<string>('');
  readonly cvv = signal<string>('');
  readonly cardholderName = signal<string>('');
  readonly sameBillingAddress = signal<boolean>(true);
  readonly showDifferentBilling = signal<boolean>(false);

  readonly submitAttempted = signal<boolean>(false);
  readonly paymentError = signal<boolean>(false);
  readonly processingComplete = signal<boolean>(false);

  private paymentSaved = false;

  readonly providerLabel = computed(() => {
    if (this.session().provider === 'mada') return this.isEn() ? 'Mada' : 'مدى';
    return WALLET_PROVIDER_LABELS[this.session().provider] || (this.isEn() ? 'Digital Wallet' : 'محفظة إلكترونية');
  });

  readonly lastFourDigits = computed(() => {
    const digits = this.cardNumber().replace(/\D/g, '').slice(-4);
    return digits.padStart(4, '•');
  });

  readonly validationErrors = computed(() => {
    const errors: Record<string, string> = {};
    const cardDigits = this.cardNumber().replace(/\D/g, '');
    const cvvDigits = this.cvv().replace(/\D/g, '');
    const name = this.cardholderName().trim();

    if (cardDigits.length !== 16) {
      errors['cardNumber'] = this.isEn() ? 'Invalid card number, please verify and try again.' : 'رقم البطاقة غير صحيح، يرجى التحقق وإعادة المحاولة.';
    }
    const expDigits = this.expiryDate().replace(/\D/g, '');
    if (expDigits.length !== 4) {
      errors['expiryDate'] = this.isEn() ? 'Invalid expiry date.' : 'تاريخ الانتهاء غير صحيح.';
    } else {
      const month = Number(expDigits.slice(0, 2));
      if (month < 1 || month > 12) {
        errors['expiryDate'] = this.isEn() ? 'Invalid expiry date.' : 'تاريخ الانتهاء غير صحيح.';
      }
    }
    if (!/^\d{3,4}$/.test(cvvDigits)) {
      errors['cvv'] = this.isEn() ? 'Invalid security code.' : 'رمز الأمان غير صحيح.';
    }
    if (name.length < 3 || /\d/.test(name)) {
      errors['cardholderName'] = this.isEn() ? 'Please enter name as shown on card.' : 'يرجى إدخال الاسم كما هو مكتوب على البطاقة.';
    }
    return errors;
  });

  readonly formIsValid = computed(() => {
    return Object.keys(this.validationErrors()).length === 0;
  });

  readonly totalQuantity = computed(() => {
    return this.session().items.reduce((sum, item) => sum + item.quantity, 0);
  });

  constructor() {
    effect(() => {
      const currentStep = this.step();
      const maxUnlocked = this.maxUnlockedStep();
      if (currentStep === 2 && maxUnlocked < 3) {
        this.processingComplete.set(false);
        const timer = setTimeout(() => {
          this.processingComplete.set(true);
          this.maxUnlockedStep.set(3);
          this.flashingStep.set(3);
        }, 2300);
      }
    });
  }

  formatCardNumber(val: string): void {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.cardNumber.set(formatted);
  }

  formatExpiry(val: string): void {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length < 3) {
      this.expiryDate.set(digits);
    } else {
      this.expiryDate.set(`${digits.slice(0, 2)} / ${digits.slice(2)}`);
    }
  }

  shouldShowError(field: string): boolean {
    return this.submitAttempted() && Boolean(this.validationErrors()[field]);
  }

  shouldShowValid(field: string, val: string): boolean {
    return Boolean(val.trim() && !this.validationErrors()[field]);
  }

  handlePaymentSubmit(event: Event): void {
    event.preventDefault();
    this.submitAttempted.set(true);

    if (!this.formIsValid()) {
      this.paymentError.set(true);
      this.maxUnlockedStep.set(1);
      this.flashingStep.set(null);
      return;
    }

    this.paymentError.set(false);
    this.maxUnlockedStep.set(2);
    this.flashingStep.set(2);
    this.step.set(2);
  }

  handleStepClick(nextStep: number): void {
    if (nextStep > this.maxUnlockedStep()) return;
    if (nextStep === 3) {
      this.savePaymentOrder();
    }
    this.step.set(nextStep);
    if (this.flashingStep() === nextStep) {
      this.flashingStep.set(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  savePaymentOrder(): void {
    if (this.paymentSaved) return;
    const sess = this.session();
    const est = new Date(sess.createdAt);
    est.setDate(est.getDate() + 4);

    this.orderTrackingService.saveTrackedOrder({
      id: sess.orderId,
      orderNumber: sess.orderNumber,
      createdAt: sess.createdAt,
      updatedAt: new Date().toISOString(),
      status: 'confirmed',
      items: sess.items.map((it) => ({
        id: it.productId,
        productId: it.productId,
        productName: it.name,
        name: it.name,
        image: it.image,
        productImage: it.image,
        size: it.size || '200ml',
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        price: it.unitPrice,
      })),
      subtotal: sess.subtotal,
      shipping: sess.shipping,
      discount: sess.discount,
      total: sess.total,
      customerName: sess.customerName,
      phone: sess.phone,
      city: sess.city,
      area: sess.area,
      address: sess.address,
      notes: sess.notes,
      paymentMethod: this.isEn() ? `E-Wallet - ${this.providerLabel()}` : `محفظة إلكترونية - ${this.providerLabel()}`,
      estimatedDelivery: est.toLocaleDateString(this.isEn() ? 'en-US' : 'ar-SA'),
    });

    this.paymentSaved = true;
    this.complete.emit();
  }

  downloadInvoice(): void {
    const sess = this.session();
    const curr = this.isEn() ? 'SAR' : 'ر.س';
    const invoice = [
      this.isEn() ? `FLARE - Order Invoice ${sess.orderNumber}` : `FLARE - فاتورة الطلب ${sess.orderNumber}`,
      this.isEn() ? `Payment Method: ${this.providerLabel()}` : `طريقة الدفع: ${this.providerLabel()}`,
      this.isEn() ? `Date: ${new Date(sess.createdAt).toLocaleDateString('en-US')}` : `التاريخ: ${new Date(sess.createdAt).toLocaleDateString('ar-SA')}`,
      this.isEn() ? `Subtotal: ${sess.subtotal} ${curr}` : `المجموع الفرعي: ${sess.subtotal} ${curr}`,
      this.isEn() ? `Shipping: ${sess.shipping} ${curr}` : `تكلفة التوصيل: ${sess.shipping} ${curr}`,
      this.isEn() ? `Total: ${sess.total} ${curr}` : `الإجمالي النهائي: ${sess.total} ${curr}`
    ].join('\n');

    const blob = new Blob([invoice], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sess.orderNumber}-invoice.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  printInvoice(): void {
    window.print();
  }

  goHome(): void {
    this.router.navigateByUrl('/');
  }

  goOrders(): void {
    this.router.navigateByUrl('/orders');
  }

  goCart(): void {
    this.router.navigateByUrl('/cart');
  }
}
