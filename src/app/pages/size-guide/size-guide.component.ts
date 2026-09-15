import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SizeGuidePageConfigService } from '../../core/services/page-configs/size-guide-page-config.service';
import { LangService } from '../../core/services/lang.service';

interface HairTypeGuide {
  typeAr: string;
  typeEn: string;
  symptomsAr: string[];
  symptomsEn: string[];
  recommendedAr: string[];
  recommendedEn: string[];
  color: string;
}

@Component({
  selector: 'app-size-guide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './size-guide.component.html',
  styleUrl: './size-guide.component.css'
})
export class SizeGuideComponent {
  private readonly configService = inject(SizeGuidePageConfigService);
  private readonly langService = inject(LangService);

  readonly isEn = this.langService.isEn;
  readonly pageConfig = this.configService.pageConfig;

  readonly pageTitle = computed(() => (this.isEn() ? this.pageConfig().pageTitleEn : this.pageConfig().pageTitleAr) || this.pageConfig().pageTitle || (this.isEn() ? 'Hair Care & Sizing Guide' : 'دليل العناية بالشعر'));
  readonly pageSubtitle = computed(() => (this.isEn() ? this.pageConfig().pageSubtitleEn : this.pageConfig().pageSubtitleAr) || this.pageConfig().pageSubtitle || (this.isEn() ? 'Discover your hair type and choose the best suited products for you' : 'تعرّف على نوع شعرك واختر المنتجات المناسبة لك'));

  readonly hairTypes: HairTypeGuide[] = [
    {
      typeAr: 'شعر جاف',
      typeEn: 'Dry Hair',
      symptomsAr: ['باهت وهش وبلا حيوية', 'ينكسر بسهولة', 'يفتقر إلى اللمعان والترطيب'],
      symptomsEn: ['Dull, brittle, and lifeless', 'Breaks easily', 'Lacks natural shine and moisture'],
      recommendedAr: ['شامبو ترطيب مكثف', 'بلسم عميق بزيت الأرغان', 'سيروم شعر طبيعي'],
      recommendedEn: ['Intense Hydration Shampoo', 'Deep Argan Conditioner', 'Natural Hair Serum'],
      color: '#A97E3D'
    },
    {
      typeAr: 'شعر دهني',
      typeEn: 'Oily Hair',
      symptomsAr: ['يبدو دهنياً بسرعة', 'فروة الرأس مفرطة الإفراز', 'ثقل في خصلات الشعر'],
      symptomsEn: ['Becomes oily quickly', 'Overactive scalp sebum', 'Weighed-down strands'],
      recommendedAr: ['شامبو موازن للدهون', 'مصل تنقية الفروة', 'بلسم خفيف للأطراف'],
      recommendedEn: ['Sebum Balancing Shampoo', 'Purifying Scalp Serum', 'Weightless Tip Conditioner'],
      color: '#8e6831'
    },
    {
      typeAr: 'شعر تالف ومتقصف',
      typeEn: 'Damaged & Split Hair',
      symptomsAr: ['تقصف واضح في الأطراف', 'تطاير وهيشان دائم', 'ضعف بسبب المعالجات الحرارية'],
      symptomsEn: ['Visible split ends', 'Persistent frizz and flyaways', 'Heat and styling damage'],
      recommendedAr: ['ماسك كيراتين معالج', 'إكسير الأرغان المركز', 'بلسم بروتين مغذي'],
      recommendedEn: ['Restorative Keratin Mask', 'Concentrated Argan Elixir', 'Nourishing Protein Conditioner'],
      color: '#c4973d'
    },
    {
      typeAr: 'تساقط الشعر',
      typeEn: 'Hair Loss & Thinning',
      symptomsAr: ['تساقط متزايد أثناء التمشيط', 'شعر خفيف وضعيف الجذور', 'فراغات ملحوظة في الفروة'],
      symptomsEn: ['Excessive shedding when brushing', 'Weak roots and thinning hair', 'Noticeable scalp patches'],
      recommendedAr: ['زيت تحفيز نمو البصيلات', 'شامبو مقوي مضاد للتساقط', 'سيروم البيوتين والكافيين'],
      recommendedEn: ['Follicle Growth Oil', 'Anti-Hair Loss Strengthening Shampoo', 'Biotin & Caffeine Serum'],
      color: '#b8892f'
    },
  ];
}

