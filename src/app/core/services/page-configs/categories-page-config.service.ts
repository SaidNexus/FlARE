import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect, inject, NgZone } from '@angular/core';


const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

export interface CategoryCardConfig {
    id: string;
    title: string;
    titleAr?: string;
    titleEn?: string;
    accent: string;
    accentAr?: string;
    accentEn?: string;
    description: string;
    descriptionAr?: string;
    descriptionEn?: string;
    path: string;
}

export interface CategoriesPageConfig {
    showTitle: boolean;
    headerTitle: string;
    headerTitleAr?: string;
    headerTitleEn?: string;
    headerSubtitle: string;
    headerSubtitleAr?: string;
    headerSubtitleEn?: string;
    categories: CategoryCardConfig[];
}


const initialConfig: CategoriesPageConfig = {
    showTitle: true,
    headerTitle: 'التصنيفات',
    headerTitleAr: 'التصنيفات',
    headerTitleEn: 'Categories',
    headerSubtitle: 'تصفحي جميع منتجات العناية بالشعر الفاخرة حسب الفئة',
    headerSubtitleAr: 'تصفحي جميع منتجات العناية بالشعر الفاخرة حسب الفئة',
    headerSubtitleEn: 'Browse all luxury hair care products by category',
    categories: [
        { id: 'shampoo', title: 'شامبو', titleAr: 'شامبو', titleEn: 'Shampoo', accent: 'الشعر', accentAr: 'الشعر', accentEn: 'Hair', description: 'شامبوهات خالية من الكبريتات\nلكل احتياجات شعرك', descriptionAr: 'شامبوهات خالية من الكبريتات\nلكل احتياجات شعرك', descriptionEn: 'Sulfate-free shampoos\nfor all hair needs', path: '/products?category=shampoo' },
        { id: 'conditioner', title: 'بلسم', titleAr: 'بلسم', titleEn: 'Conditioner', accent: 'وترطيب', accentAr: 'وترطيب', accentEn: '& Hydration', description: 'بلسمات وأقنعة\nلشعر ناعم وصحي', descriptionAr: 'بلسمات وأقنعة\nلشعر ناعم وصحي', descriptionEn: 'Conditioners & masks\nfor smooth, healthy hair', path: '/products?category=conditioner' },
        { id: 'hair-oil', title: 'زيوت', titleAr: 'زيوت', titleEn: 'Hair Oils', accent: 'الشعر', accentAr: 'الشعر', accentEn: 'Nourishment', description: 'زيوت طبيعية فاخرة\nتغذية وتقوية فائقة', descriptionAr: 'زيوت طبيعية فاخرة\nتغذية وتقوية فائقة', descriptionEn: 'Luxury natural oils\nintense nourishment', path: '/products?category=hair-oil' },
        { id: 'hair-mask', title: 'أقنعة', titleAr: 'أقنعة', titleEn: 'Hair Masks', accent: 'كيراتين', accentAr: 'كيراتين', accentEn: 'Keratin', description: 'أقنعة كيراتين وترميم\nعلاج مكثف للشعر التالف', descriptionAr: 'أقنعة كيراتين وترميم\nعلاج مكثف للشعر التالف', descriptionEn: 'Keratin repair masks\ndeep restorative care', path: '/products?category=hair-mask' },
        { id: 'treatment', title: 'سيروم', titleAr: 'سيروم', titleEn: 'Serum', accent: 'وعلاجات', accentAr: 'وعلاجات', accentEn: '& Treatments', description: 'سيرومات متطورة\nحماية ومقاومة للتقصف', descriptionAr: 'سيرومات متطورة\nحماية ومقاومة للتقصف', descriptionEn: 'Advanced serums\nsplit-end prevention', path: '/products?category=treatment' },
        { id: 'scalp-care', title: 'عناية', titleAr: 'عناية', titleEn: 'Scalp Care', accent: 'الفروة', accentAr: 'الفروة', accentEn: 'Balance', description: 'عناية متخصصة\nلفروة رأس صحية ومنتعشة', descriptionAr: 'عناية متخصصة\nلفروة رأس صحية ومنتعشة', descriptionEn: 'Targeted scalp care\nhealthy & refreshed', path: '/products?category=scalp-care' }
    ]
};

@Injectable({
  providedIn: 'root'
})
export class CategoriesPageConfigService {
  private readonly storageKey = 'FLARE-categories-page-config';

  private isApplyingExternalUpdate = false;
  private lastSavedJson: string = '';

  readonly pageConfig = signal<CategoriesPageConfig>(this.loadInitialConfig());
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

  updateConfig(newConfig: CategoriesPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): CategoriesPageConfig {
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
