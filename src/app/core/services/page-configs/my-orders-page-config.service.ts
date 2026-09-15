import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect , NgZone, inject} from '@angular/core';


const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

export interface MyOrdersPageConfig {
    headerTitle: string;
    headerTitleAr?: string;
    headerTitleEn?: string;
    headerSubtitle: string;
    headerSubtitleAr?: string;
    headerSubtitleEn?: string;
    
    phonePlaceholder: string;
    phonePlaceholderAr?: string;
    phonePlaceholderEn?: string;
    orderPlaceholder: string;
    orderPlaceholderAr?: string;
    orderPlaceholderEn?: string;
    buttonText: string;
    buttonTextAr?: string;
    buttonTextEn?: string;
    
    emptyTitle: string;
    emptyTitleAr?: string;
    emptyTitleEn?: string;
    emptyText: string;
    emptyTextAr?: string;
    emptyTextEn?: string;
    emptyCta: string;
    emptyCtaAr?: string;
    emptyCtaEn?: string;
    
    notFoundTitle: string;
    notFoundTitleAr?: string;
    notFoundTitleEn?: string;
    notFoundText: string;
    notFoundTextAr?: string;
    notFoundTextEn?: string;
    
    showSupportCard: boolean;
    supportTitle: string;
    supportTitleAr?: string;
    supportTitleEn?: string;
    supportText: string;
    supportTextAr?: string;
    supportTextEn?: string;
}


const initialConfig: MyOrdersPageConfig = {
    headerTitle: 'طلبياتي',
    headerTitleAr: 'طلبياتي',
    headerTitleEn: 'My Orders',
    headerSubtitle: 'تابع حالة طلباتك واستعرض تفاصيلها',
    headerSubtitleAr: 'تابع حالة طلباتك واستعرض تفاصيلها',
    headerSubtitleEn: 'Track your orders and view their details',
    
    phonePlaceholder: 'رقم الهاتف',
    phonePlaceholderAr: 'رقم الهاتف',
    phonePlaceholderEn: 'Phone Number',
    orderPlaceholder: 'رقم الطلب',
    orderPlaceholderAr: 'رقم الطلب',
    orderPlaceholderEn: 'Order Number',
    buttonText: 'تتبع',
    buttonTextAr: 'تتبع',
    buttonTextEn: 'Track',
    
    emptyTitle: 'لا توجد طلبيات بعد',
    emptyTitleAr: 'لا توجد طلبيات بعد',
    emptyTitleEn: 'No orders yet',
    emptyText: 'لم تقم بأي طلبات حتى الآن، استكشف منتجاتنا المميزة.',
    emptyTextAr: 'لم تقم بأي طلبات حتى الآن، استكشف منتجاتنا المميزة.',
    emptyTextEn: 'You haven\'t placed any orders yet. Explore our featured products.',
    emptyCta: 'ابدأ التسوق',
    emptyCtaAr: 'ابدأ التسوق',
    emptyCtaEn: 'Start Shopping',
    
    notFoundTitle: 'لم يتم العثور على طلب مطابق',
    notFoundTitleAr: 'لم يتم العثور على طلب مطابق',
    notFoundTitleEn: 'No matching order found',
    notFoundText: 'تأكدي من رقم الهاتف أو رقم الطلب ثم حاولي مرة أخرى.',
    notFoundTextAr: 'تأكدي من رقم الهاتف أو رقم الطلب ثم حاولي مرة أخرى.',
    notFoundTextEn: 'Please check your phone number or order ID and try again.',
    
    showSupportCard: true,
    supportTitle: 'نحن هنا لمساعدتك',
    supportTitleAr: 'نحن هنا لمساعدتك',
    supportTitleEn: 'We are here to help',
    supportText: 'إذا واجهت أي مشكلة، تواصل معنا عبر واتساب',
    supportTextAr: 'إذا واجهت أي مشكلة، تواصل معنا عبر واتساب',
    supportTextEn: 'If you encounter any issues, reach out to us via WhatsApp'
};

@Injectable({
  providedIn: 'root'
})
export class MyOrdersPageConfigService {
  private readonly storageKey = 'FLARE-myorders-page-config';

  private isApplyingExternalUpdate = false;
  private lastSavedJson: string = '';

  readonly pageConfig = signal<MyOrdersPageConfig>(this.loadInitialConfig());

  private zone = inject(NgZone);

  constructor() {
    this.lastSavedJson = JSON.stringify(this.pageConfig());

    window.addEventListener('storage', (e: StorageEvent) => {
      if ((e as any).__sourceInstanceId === INSTANCE_ID) return; // Discard self-triggered synthetic events

      if (e.key === this.storageKey && e.newValue) {
        if (e.newValue === this.lastSavedJson) return; // Discard echo / identical payload

        try {
          const updated = JSON.parse(e.newValue);
          const merged = this.mergeWithInitial(updated);
          const mergedJson = JSON.stringify(merged);
          if (mergedJson === this.lastSavedJson) return;

          this.zone.run(() => {
            this.isApplyingExternalUpdate = true;
            this.lastSavedJson = mergedJson;
            this.pageConfig.set(merged);
            queueMicrotask(() => {
              this.isApplyingExternalUpdate = false;
            });
          });
        } catch (_) {}
      }
    });

    effect(() => {
      const config = this.pageConfig();
      const stringified = JSON.stringify(config);

      if (this.isApplyingExternalUpdate) return;
      if (stringified === this.lastSavedJson) return;

      this.lastSavedJson = stringified;
      localStorage.setItem(this.storageKey, stringified);
      
      try {
        const event = new StorageEvent('storage', {
          key: this.storageKey,
          newValue: stringified,
          storageArea: localStorage,
        });
        (event as any).__sourceInstanceId = INSTANCE_ID;
        window.dispatchEvent(event);
      } catch (_) {}
    });
  }

  updateConfig(newConfig: MyOrdersPageConfig) {
    this.zone.run(() => { this.pageConfig.set(newConfig); });
  }

  private loadInitialConfig(): MyOrdersPageConfig {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return initialConfig;
  }

  private mergeWithInitial(parsed: any): any {
    return sanitizeWithInitial(parsed, initialConfig);
  }
}
