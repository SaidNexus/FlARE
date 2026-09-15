import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LangService } from '../../core/services/lang/lang.service';
import { AboutPageConfigService } from '../../core/services/page-configs/about-page-config.service';

interface ValueItem {
  icon: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  private configService = inject(AboutPageConfigService);
  protected langService = inject(LangService);
  readonly config = this.configService.pageConfig;

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');

  readonly defaultValues = computed<ValueItem[]>(() => {
    const en = this.isEn();
    return [
      {
        icon: 'star',
        title: en ? 'Premium Quality' : 'جودة فائقة',
        desc: en ? 'We commit to delivering scientifically backed, high-potency hair formulas ensuring best results.' : 'نلتزم بتقديم منتجات ذات فعالية عالية ومكونات معتمدة علمياً تضمن لك أفضل النتائج.',
      },
      {
        icon: 'leaf',
        title: en ? '100% Pure & Natural' : 'طبيعي 100%',
        desc: en ? 'Completely free from harsh sulfates and harmful chemicals, relying on natural botanical extracts.' : 'تركيباتنا خالية تماماً من الكبريتات والمواد الضارة، ونعتمد على المستخلصات الطبيعية.',
      },
      {
        icon: 'flask',
        title: en ? 'Clinically Tested' : 'مختبر سريرياً',
        desc: en ? 'Every single product undergoes rigorous clinical evaluations ensuring safety and peak efficacy.' : 'جميع منتجاتنا تخضع لاختبارات صارمة لضمان الفعالية والأمان على جميع أنواع الشعر.',
      },
      {
        icon: 'shield',
        title: en ? 'Proudly Crafted' : 'صنع باعتزاز',
        desc: en ? 'Proudly designed and manufactured to the most stringent international standards within Saudi Arabia.' : 'نفخر بأن جميع منتجاتنا مصممة ومصنعة بأعلى المعايير داخل المملكة العربية السعودية.',
      },
    ];
  });

  get values(): ValueItem[] {
    const en = this.isEn();
    const defaults = this.defaultValues();
    const cfgValues = this.config()?.values;
    if (cfgValues && cfgValues.length > 0) {
      return cfgValues.map((v: any, idx: number) => ({
        icon: (v.icon || '').toLowerCase().includes('shield') ? 'shield' : ((v.icon || '').toLowerCase().includes('star') ? 'star' : (idx === 1 ? 'leaf' : 'flask')),
        title: en ? (v.labelEn || v.label || defaults[idx % defaults.length].title) : (v.labelAr || v.label || defaults[idx % defaults.length].title),
        desc: defaults[idx % defaults.length].desc
      }));
    }
    return defaults;
  }
}
