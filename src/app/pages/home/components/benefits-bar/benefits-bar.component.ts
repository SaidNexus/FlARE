import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '../../../../core/services/lang/lang.service';
import { getEnglishTranslation } from '../../../../core/utils/config-sanitizer';

interface BenefitItem {
  icon: 'cash' | 'delivery' | 'exchange';
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-benefits-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './benefits-bar.component.html',
  styleUrl: './benefits-bar.component.css'
})
export class BenefitsBarComponent {
  @Input() config?: any;
  public readonly langService = inject(LangService);

  get isEn(): boolean {
    return this.langService.storefrontLang() === 'en';
  }

  private readonly defaultBenefitsAr: BenefitItem[] = [
    {
      icon: 'cash',
      title: 'دفع عند الاستلام',
      subtitle: 'ادفع بعد الاستلام',
    },
    {
      icon: 'delivery',
      title: 'شحن مجاني',
      subtitle: 'لجميع الطلبات في المملكة',
    },
    {
      icon: 'exchange',
      title: 'استرجاع مجاني',
      subtitle: 'خلال 14 يوم بكل سهولة',
    },
  ];

  private readonly defaultBenefitsEn: BenefitItem[] = [
    {
      icon: 'cash',
      title: 'Cash on Delivery',
      subtitle: 'Pay upon delivery',
    },
    {
      icon: 'delivery',
      title: 'Free Shipping',
      subtitle: 'On all orders in KSA',
    },
    {
      icon: 'exchange',
      title: 'Free Returns',
      subtitle: 'Within 14 days easily',
    },
  ];

  get benefits(): BenefitItem[] {
    const defaults = this.isEn ? this.defaultBenefitsEn : this.defaultBenefitsAr;

    if (this.config?.benefits && Array.isArray(this.config.benefits)) {
      const enabled = this.config.benefits.filter((b: any) => b.enabled !== false);
      if (enabled.length > 0) {
        return enabled.map((b: any, idx: number) => {
          let title = '';
          let subtitle = '';

          if (this.isEn) {
            if (b.titleEn) {
              title = b.titleEn;
              subtitle = b.subtitleEn || '';
            } else if (b.textEn) {
              const parts = b.textEn.split('\n');
              title = parts[0] || '';
              subtitle = parts[1] || '';
            } else {
              let rawTitle = b.title || b.titleAr || '';
              let rawSubtitle = b.subtitle || b.subtitleAr || '';
              if (!rawTitle && b.text) {
                const parts = b.text.split('\n');
                rawTitle = parts[0] || '';
                rawSubtitle = parts[1] || '';
              }
              title = getEnglishTranslation(rawTitle, rawTitle);
              subtitle = getEnglishTranslation(rawSubtitle, rawSubtitle);
            }
          } else {
            title = b.titleAr || b.title || '';
            subtitle = b.subtitleAr || b.subtitle || '';
            if (!title && b.text) {
              const parts = b.text.split('\n');
              title = parts[0] || '';
              subtitle = parts[1] || '';
            }
          }

          let iconType: 'cash' | 'delivery' | 'exchange' = 'cash';
          const iconStr = (b.icon || '').toLowerCase();
          if (iconStr.includes('truck') || iconStr.includes('delivery')) {
            iconType = 'delivery';
          } else if (iconStr.includes('refresh') || iconStr.includes('exchange') || iconStr.includes('return')) {
            iconType = 'exchange';
          } else {
            iconType = idx === 1 ? 'delivery' : (idx === 2 ? 'exchange' : 'cash');
          }

          return {
            icon: iconType,
            title: title || defaults[idx % defaults.length].title,
            subtitle: subtitle || defaults[idx % defaults.length].subtitle,
          };
        });
      }
    }
    return defaults;
  }
}
