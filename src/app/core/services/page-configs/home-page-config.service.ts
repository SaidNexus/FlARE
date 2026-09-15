import { Injectable, signal, effect, PLATFORM_ID, Inject, inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, from } from 'rxjs';
import { debounceTime, map, catchError } from 'rxjs/operators';
import { PageConfig } from '../../models/config.model';
import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { homeCategories, homeProducts } from '../../../shared/data/homePageData';
import { environment } from '../../../../environments/environment';

const CONFIG_KEY = 'FLARE-homepage-config';
const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID
  ? crypto.randomUUID()
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

const heroVisual = '/assets/covers/hero-model-products.png';
const offerBanner = '/assets/images/covers/concer-banner.png';

const initialConfig: PageConfig = {
  sections: [
    {
      id: 'sec-hero',
      type: 'hero',
      enabled: true,
      title: 'منتجات العناية بالشعر الفاخرة',
      titleAr: 'منتجات العناية بالشعر الفاخرة',
      titleEn: 'Luxury Hair Care Products',
      image: heroVisual,
      slides: [
        { id: 'slide-1', image: heroVisual, title: 'شعر أكثر قوة\nوكثافة ولمعان', titleAr: 'شعر أكثر قوة\nوكثافة ولمعان', titleEn: 'Stronger, Fuller\n& Radiant Hair' }
      ]
    },
    {
      id: 'sec-benefits',
      type: 'benefits',
      enabled: true,
      benefits: [
        { id: 'b1', text: 'دفع عند الاستلام\nادفع بعد الاستلام', textAr: 'دفع عند الاستلام\nادفع بعد الاستلام', textEn: 'Cash on Delivery\nPay upon delivery', icon: 'CreditCard', enabled: true },
        { id: 'b2', text: 'شحن مجاني\nلجميع الطلبات في المملكة', textAr: 'شحن مجاني\nلجميع الطلبات في المملكة', textEn: 'Free Shipping\nOn all orders in KSA', icon: 'Truck', enabled: true },
        { id: 'b3', text: 'استرجاع مجاني\nخلال 14 يوم بكل سهولة', textAr: 'استرجاع مجاني\nخلال 14 يوم بكل سهولة', textEn: 'Free Returns\nWithin 14 days easily', icon: 'RefreshCcw', enabled: true }
      ]
    },
    {
      id: 'sec-categories',
      type: 'categories',
      enabled: true,
      title: 'تسوق حسب الفئة',
      titleAr: 'تسوق حسب الفئة',
      titleEn: 'Shop by Category',
      showTitle: true,
      categories: [
        { id: 'shampoo', name: 'شامبو العناية', nameAr: 'شامبو العناية', nameEn: 'Care Shampoo', image: '/assets/images/categories/hair-icon.png' },
        { id: 'conditioner', name: 'بلسم الترطيب', nameAr: 'بلسم الترطيب', nameEn: 'Conditioner', image: '/assets/images/categories/hair-icon.png' },
        { id: 'hair-oil', name: 'زيوت الشعر', nameAr: 'زيوت الشعر', nameEn: 'Hair Oils', image: '/assets/images/categories/hair-icon.png' },
        { id: 'treatment', name: 'علاجات وماسكات', nameAr: 'علاجات وماسكات', nameEn: 'Treatments', image: '/assets/images/categories/hair-icon.png' }
      ]
    },
    {
      id: 'sec-bestsellers',
      type: 'bestsellers',
      enabled: true,
      title: 'الأكثر مبيعاً',
      titleAr: 'الأكثر مبيعاً',
      titleEn: 'Bestsellers',
      showTitle: true,
      products: [
        { id: 'home-product-1', productId: 'prod-1', name: 'شامبو مكافح للقشرة', nameAr: 'شامبو مكافح للقشرة', nameEn: 'Anti-Dandruff Shampoo', price: 49.99, originalPrice: 79.99, image: '/assets/images/products/shampoo/shampoo-dandruff.png', rating: 4.8, reviewsCount: 237 },
        { id: 'home-product-2', productId: 'prod-2', name: 'بلسم مكثف للترطيب', nameAr: 'بلسم مكثف للترطيب', nameEn: 'Hydrating Conditioner', price: 64.99, originalPrice: 89.99, image: '/assets/images/products/shampoo/temp.png', rating: 4.6, reviewsCount: 184 },
        { id: 'home-product-3', productId: 'prod-3', name: 'زيت تحفيز نمو الشعر', nameAr: 'زيت تحفيز نمو الشعر', nameEn: 'Hair Growth Oil', price: 39.99, image: '/assets/images/products/shampoo/shampoo-dandruff.png', rating: 4.9, reviewsCount: 312 },
        { id: 'home-product-4', productId: 'prod-4', name: 'قناع إصلاح بروتين الكيراتين', nameAr: 'قناع إصلاح بروتين الكيراتين', nameEn: 'Keratin Repair Mask', price: 44.99, originalPrice: 59.99, image: '/assets/images/products/shampoo/temp.png', rating: 4.5, reviewsCount: 98 }
      ]
    },
    {
      id: 'sec-promo',
      type: 'promo',
      enabled: true,
      titleAr: 'عروض حصرية',
      titleEn: 'Exclusive Offers',
      image: offerBanner
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class HomePageConfigService {
  private readonly storageKey = CONFIG_KEY;
  private readonly http = inject(HttpClient);

  readonly pageConfig = signal<PageConfig>(this.loadInitialConfig());

  private updateSubject = new Subject<PageConfig>();

  private zone = inject(NgZone);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // 0. Setup debounced backend sync
      this.updateSubject.pipe(
        debounceTime(750)
      ).subscribe((newConfig) => {
        const payload = {
          sectionsJson: JSON.stringify(newConfig.sections)
        };
        this.http.put(`${environment.apiUrl}/home-page-config`, payload).subscribe({
          error: (err) => {
            console.warn('Could not persist homepage config to server, retaining local cache:', err);
          }
        });
      });

      // 1. Fetch persistent configuration from Backend API on boot
      this.fetchFromBackend();

      // 2. Cross-tab/frame synchronization with echo prevention
      window.addEventListener('storage', (e: StorageEvent) => {
        if ((e as any).__sourceInstanceId === INSTANCE_ID) {
          return; // Discard self-triggered synthetic events
        }

        if (e.key === this.storageKey && e.newValue) {
          try {
            const updated = JSON.parse(e.newValue);
            this.zone.run(() => { this.pageConfig.set(this.mergeWithInitial(updated)); });
          } catch (_) { }
        }
      });

      // 3. Keep local cache in sync and broadcast to preview iframes
      effect(() => {
        const config = this.pageConfig();
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(config));
        } catch (_) { }

        try {
          const event = new StorageEvent('storage', {
            key: this.storageKey,
            newValue: JSON.stringify(config),
            storageArea: localStorage
          });
          (event as any).__sourceInstanceId = INSTANCE_ID;
          window.dispatchEvent(event);
        } catch (_) { }
      });
    }
  }

  updateConfig(newConfig: PageConfig) {
    // 1. Optimistic local update
    this.zone.run(() => { this.pageConfig.set(newConfig); });

    // 2. Persist to Backend via debounced subject
    this.updateSubject.next(newConfig);
  }

  setPageConfig(newConfig: PageConfig) {
    this.updateConfig(newConfig);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${environment.apiUrl}/home-page-config/upload-image`, formData).pipe(
      map(res => ({ url: (res?.data?.url || res?.data || res?.url) as string })),
      catchError(() => {
        return from(
          new Promise<{ url: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ url: reader.result as string });
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          })
        );
      })
    );
  }

  private fetchFromBackend() {
    this.http.get<any>(`${environment.apiUrl}/home-page-config`).subscribe({
      next: (res) => {
        const data = res?.data || res;
        if (data?.sectionsJson && data.sectionsJson.length > 2 && data.sectionsJson !== '[]') {
          try {
            const parsedSections = JSON.parse(data.sectionsJson);
            if (Array.isArray(parsedSections) && parsedSections.length > 0) {
              const merged = this.mergeWithInitial({ sections: parsedSections });
              this.zone.run(() => { this.pageConfig.set(merged); });
            }
          } catch (e) {
            console.error('Failed to parse sectionsJson from backend:', e);
          }
        }
      },
      error: () => {
        // Fallback silently to localStorage cache
      }
    });
  }

  private loadInitialConfig(): PageConfig {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return this.mergeWithInitial(parsed);
        } catch (_) { }
      }
    }
    return initialConfig;
  }

  private normalizeImageUrl(url: any, fallback: string): string {
    if (!url || typeof url !== 'string' || url.trim() === '') return fallback;
    const clean = url.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) return clean;
    return clean.startsWith('/') ? clean : '/' + clean;
  }

  private mergeWithInitial(parsed: any): PageConfig {
    const config = sanitizeWithInitial(parsed, initialConfig);
    if (config?.sections) {
      for (const sec of config.sections) {
        if (sec.type === 'hero') {
          sec.image = this.normalizeImageUrl(sec.image, heroVisual);
          if (Array.isArray(sec.slides)) {
            sec.slides = sec.slides.map((s: any) => ({
              ...s,
              image: this.normalizeImageUrl(s?.image, heroVisual)
            }));
          }
        }
        if (sec.type === 'promo') {
          if (!sec.image || sec.image.includes('products-banner.png')) {
            sec.image = offerBanner;
          } else {
            sec.image = this.normalizeImageUrl(sec.image, offerBanner);
          }
        }
        if (sec.type === 'categories' && Array.isArray(sec.categories)) {
          sec.categories = sec.categories.map((c: any) => ({
            ...c,
            image: this.normalizeImageUrl(c?.image, '/assets/images/categories/hair-icon.png')
          }));
        }
        if (sec.type === 'bestsellers' && Array.isArray(sec.products)) {
          const aliasMap: Record<string, string> = {
            'home-product-1': 'prod-1',
            'home-product-2': 'prod-2',
            'home-product-3': 'prod-3',
            'home-product-4': 'prod-4',
            'home-product-5': 'prod-7'
          };
          sec.products = sec.products.map((p: any) => {
            const mappedId = aliasMap[p.id] || p.productId || p.id;
            return {
              ...p,
              image: this.normalizeImageUrl(p?.image, '/assets/images/products/shampoo/shampoo-dandruff.png'),
              productId: p.productId || mappedId,
              id: mappedId
            };
          });
        }
      }
    }
    return config;
  }
}
