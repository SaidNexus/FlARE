import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LangService } from '../../core/services/lang/lang.service';

interface ProblemItem {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  descEn: string;
  image: string;
}

interface TrustItem {
  title: string;
  titleEn: string;
  sub: string;
  subEn: string;
  icon: 'shield' | 'card' | 'truck' | 'users';
}

@Component({
  selector: 'app-problems',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './problems.component.html',
  styleUrl: './problems.component.css'
})
export class ProblemsComponent {
  protected readonly langService = inject(LangService);
  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');

  readonly problems: ProblemItem[] = [
    {
      id: 'dryness',
      name: 'الجفاف',
      nameEn: 'Dryness',
      desc: 'يرطب بعمق ويعيد النعومة واللمعان',
      descEn: 'Deeply hydrates and restores softness and natural shine',
      image: '/assets/images/categories/hair-icon.png',
    },
    {
      id: 'dandruff',
      name: 'القشرة',
      nameEn: 'Dandruff',
      desc: 'يقضي على القشرة ويمنع عودتها',
      descEn: 'Eliminates flakes and effectively prevents recurrence',
      image: '/assets/images/categories/hair-icon.png',
    },
    {
      id: 'hairloss',
      name: 'التساقط',
      nameEn: 'Hair Loss',
      desc: 'يقلل التساقط ويقوي البصيلات من الجذور',
      descEn: 'Reduces hair fall and strengthens follicles from the roots',
      image: '/assets/images/categories/hair-icon.png',
    },
    {
      id: 'growth',
      name: 'بطء النمو',
      nameEn: 'Slow Growth',
      desc: 'يحفز نمو الشعر ويزيد من طوله',
      descEn: 'Stimulates micro-circulation for faster, healthier growth',
      image: '/assets/images/concerns/growth.png',
    },
    {
      id: 'frizz',
      name: 'الشعر الخشن',
      nameEn: 'Frizzy & Coarse Hair',
      desc: 'ينعم الخصلات ويقلل التجعد والخشونة',
      descEn: 'Tames unruly strands and eliminates stubborn frizz',
      image: '/assets/images/categories/hair-icon.png',
    },
    {
      id: 'itchy',
      name: 'الحكة',
      nameEn: 'Scalp Itchiness',
      desc: 'يهدئ فروة الرأس ويخفف الحكة والتهيج',
      descEn: 'Instantly soothes scalp discomfort and irritation',
      image: '/assets/images/categories/hair-icon.png',
    },
    {
      id: 'protein',
      name: 'العناية بعد البروتين والميش',
      nameEn: 'Post-Protein & Bleach Care',
      desc: 'يحافظ على النتائج ويطيل نعومة الشعر ولمعانه',
      descEn: 'Maintains salon treatment results and prolongs smoothness',
      image: '/assets/images/concerns/growth.png',
    },
    {
      id: 'dyed',
      name: 'العناية بعد الصبغة',
      nameEn: 'Color-Treated Hair',
      desc: 'يحمي اللون ويمنع الجفاف والتلف',
      descEn: 'Locks in vibrant hue and shields against chemical damage',
      image: '/assets/images/categories/hair-icon.png',
    },
    {
      id: 'thinning',
      name: 'ضعف الكثافة',
      nameEn: 'Thinning Hair',
      desc: 'يعزز الكثافة ويمنح مظهراً أكثر امتلاءً',
      descEn: 'Amplifies hair body and promotes a visibly fuller look',
      image: '/assets/images/concerns/growth.png',
    },
  ];

  readonly trustItems: TrustItem[] = [
    { title: 'منتجات أصلية', titleEn: '100% Authentic', sub: 'جودة مضمونة', subEn: 'Guaranteed Quality', icon: 'shield' },
    { title: 'دفع عند الاستلام', titleEn: 'Cash on Delivery', sub: 'آمن وسهل', subEn: 'Safe & Convenient', icon: 'card' },
    { title: 'توصيل سريع', titleEn: 'Fast Delivery', sub: 'لجميع المناطق', subEn: 'To All Locations', icon: 'truck' },
    { title: 'للرجال والنساء', titleEn: 'Men & Women', sub: 'مناسب للجميع', subEn: 'Suitable for All', icon: 'users' },
  ];
}
