import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '../../core/services/lang/lang.service';
import { FaqPageConfigService } from '../../core/services/page-configs/faq-page-config.service';

interface FaqItem {
  q: string;
  a: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
})
export class FaqComponent {
  private faqConfigService = inject(FaqPageConfigService);
  protected langService = inject(LangService);
  openIndex = 0;

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');

  readonly defaultFaqs = computed<FaqItem[]>(() => {
    const en = this.isEn();
    return [
      {
        q: en ? 'What is the difference between regular shampoo and FLARE?' : 'ما الفرق بين شامبو الشعر العادي وشامبو FLARE؟',
        a: en ? 'FLARE shampoo is formulated with pure botanical ingredients and is 100% sulfate and paraben-free, making it completely safe for daily use.' : 'شامبو FLARE مصنوع بمكونات طبيعية مدروسة ويخلو من الكبريتات والمواد القاسية، مما يجعله آمنًا للاستخدام اليومي.',
      },
      {
        q: en ? 'How often should I use the products to see results?' : 'كم مرة يجب استخدام المنتجات لرؤية النتائج؟',
        a: en ? 'Varies by concern. Anti-hair loss routines show significant reduction in 4-6 weeks. Hydration masks show immediate silkiness from first wash.' : 'تتفاوت حسب نوع المنتج. منتجات مكافحة التساقط: 4-6 أسابيع. أقنعة الترطيب: من الاستخدام الأول.',
      },
      {
        q: en ? 'Are FLARE products safe for color-treated and keratin hair?' : 'هل منتجات FLARE مناسبة للشعر المصبوغ؟',
        a: en ? 'Yes, absolutely. We offer specialized lines designed to protect color brilliance and extend keratin and protein smoothing treatments.' : 'نعم. لدينا خط مخصص للشعر المعالج كيميائيًا يساعد على استعادة الحيوية والترطيب.',
      },
      {
        q: en ? 'Are FLARE products clinically tested and certified?' : 'هل منتجات FLARE مختبرة طبياً؟',
        a: en ? 'Yes, all our formulas are rigorously dermatologically tested and approved by relevant health authorities.' : 'نعم. جميع منتجاتنا تجتاز اختبارات مخبرية صارمة ومعتمدة.',
      },
      {
        q: en ? 'What is your exchange and return policy?' : 'ما سياسة الاستبدال والإرجاع؟',
        a: en ? 'We accept returns and exchanges for unopened, sealed products within 14 days of delivery.' : 'نقبل المنتجات غير المفتوحة في غضون 30 يومًا من تاريخ الشراء.',
      },
      {
        q: en ? 'What are your delivery areas and timelines?' : 'ما هي مناطق التوصيل؟',
        a: en ? 'We ship to all regions in Saudi Arabia within 2-4 business days, with express courier tracking.' : 'نوصل إلى جميع مناطق المملكة العربية السعودية خلال 2-5 أيام عمل.',
      },
    ];
  });

  get title(): string {
    const en = this.isEn();
    const cfg = this.faqConfigService.pageConfig();
    return (en ? cfg?.titleEn : cfg?.titleAr) || cfg?.title || (en ? 'Frequently Asked Questions' : 'الأسئلة الشائعة');
  }

  get subtitle(): string {
    const en = this.isEn();
    const cfg = this.faqConfigService.pageConfig();
    return (en ? cfg?.subtitleEn : cfg?.subtitleAr) || cfg?.subtitle || (en ? 'Answers to our most frequently asked questions.' : 'إجابات لأكثر الأسئلة التي تصلنا من عملائنا.');
  }

  get faqs(): FaqItem[] {
    const en = this.isEn();
    const cfgs = this.faqConfigService.pageConfig()?.faqs;
    if (cfgs && cfgs.length > 0) {
      return cfgs.map(f => ({
        q: (en ? (f.questionEn || f.question) : (f.questionAr || f.question)) || '',
        a: (en ? (f.answerEn || f.answer) : (f.answerAr || f.answer)) || ''
      }));
    }
    return this.defaultFaqs();
  }

  toggleFaq(index: number): void {
    this.openIndex = this.openIndex === index ? -1 : index;
  }
}
