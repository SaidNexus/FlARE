import { Component, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FaqPageConfigService } from '../../../../core/services/page-configs/faq-page-config.service';
import { LangService } from '../../../../core/services/lang/lang.service';
import { getEnglishTranslation } from '../../../../core/utils/config-sanitizer';

export interface FaqItem {
  id: string;
  question: string;
  questionAr?: string;
  questionEn?: string;
  answer: string;
  answerAr?: string;
  answerEn?: string;
}

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.css'
})
export class FaqSectionComponent {
  readonly className = input<string>('');
  private faqConfigService = inject(FaqPageConfigService);
  public readonly langService = inject(LangService);

  get isEn(): boolean {
    return this.langService.storefrontLang() === 'en';
  }

  readonly defaultFaqItems: FaqItem[] = [
    {
      id: 'size',
      question: 'كيف أختار المنتج المناسب لنوع شعري؟',
      questionAr: 'كيف أختار المنتج المناسب لنوع شعري؟',
      questionEn: 'How do I choose the right product for my hair type?',
      answer: 'يمكنك اختيار المنتجات بحسب نوع شعرك وحالته (جاف، دهني، مصبوغ، أو متساقط) من خلال صفحة المنتجات أو بالتواصل مع فريق خبرائنا.',
      answerAr: 'يمكنك اختيار المنتجات بحسب نوع شعرك وحالته (جاف، دهني، مصبوغ، أو متساقط) من خلال صفحة المنتجات أو بالتواصل مع فريق خبرائنا.',
      answerEn: 'You can select products based on your hair type and condition (dry, oily, colored, or falling) on our products page or by consulting our team.',
    },
    {
      id: 'exchange',
      question: 'هل يمكن الاستبدال؟',
      questionAr: 'هل يمكن الاستبدال؟',
      questionEn: 'Is return and exchange available?',
      answer: 'نعم، يمكنك طلب الاستبدال خلال 14 يومًا من الاستلام بشرط أن تكون المنتجات بحالتها الأصلية ولم يتم استخدامها أو فتحها.',
      answerAr: 'نعم، يمكنك طلب الاستبدال خلال 14 يومًا من الاستلام بشرط أن تكون المنتجات بحالتها الأصلية ولم يتم استخدامها أو فتحها.',
      answerEn: 'Yes, you can request an exchange within 14 days of receipt, provided items are unopened and in their original condition.',
    },
    {
      id: 'delivery',
      question: 'كم مدة التوصيل؟',
      questionAr: 'كم مدة التوصيل؟',
      questionEn: 'How long does delivery take?',
      answer: 'يستغرق التوصيل عادةً من يومين إلى خمسة أيام عمل لكافة مدن ومناطق المملكة.',
      answerAr: 'يستغرق التوصيل عادةً من يومين إلى خمسة أيام عمل لكافة مدن ومناطق المملكة.',
      answerEn: 'Delivery typically takes 2 to 5 business days to all cities and regions across Saudi Arabia.',
    },
    {
      id: 'cod',
      question: 'هل الدفع عند الاستلام متوفر؟',
      questionAr: 'هل الدفع عند الاستلام متوفر؟',
      questionEn: 'Is cash on delivery available?',
      answer: 'نعم، الدفع عند الاستلام متاح لجميع الطلبات في المملكة.',
      answerAr: 'نعم، الدفع عند الاستلام متاح لجميع الطلبات في المملكة.',
      answerEn: 'Yes, Cash on Delivery is available for all orders across the Kingdom.',
    },
    {
      id: 'usage',
      question: 'كيف أستخدم المنتجات؟',
      questionAr: 'كيف أستخدم المنتجات؟',
      questionEn: 'How do I use the products?',
      answer: 'اتبعي التعليمات المكتوبة على العبوة لكل منتج. للحصول على أفضل النتائج، استخدمي الروتين المتكامل بانتظام.',
      answerAr: 'اتبعي التعليمات المكتوبة على العبوة لكل منتج. للحصول على أفضل النتائج، استخدمي الروتين المتكامل بانتظام.',
      answerEn: 'Follow the instructions printed on each product package. For optimal results, use the complete routine regularly.',
    },
  ];

  get faqItems(): FaqItem[] {
    const cfgs = this.faqConfigService.pageConfig()?.faqs;
    if (cfgs && cfgs.length > 0) {
      return cfgs.map((f, idx) => {
        const rawQAr = f.questionAr || f.question || '';
        const rawAAr = f.answerAr || f.answer || '';
        const question = this.isEn
          ? (f.questionEn || getEnglishTranslation(rawQAr, rawQAr))
          : rawQAr;
        const answer = this.isEn
          ? (f.answerEn || getEnglishTranslation(rawAAr, rawAAr))
          : rawAAr;
        return {
          id: f.id || `faq-${idx}`,
          question,
          answer
        };
      });
    }
    return this.defaultFaqItems.map((item) => ({
      id: item.id,
      question: this.isEn ? (item.questionEn || item.question) : (item.questionAr || item.question),
      answer: this.isEn ? (item.answerEn || item.answer) : (item.answerAr || item.answer),
    }));
  }

  readonly query = signal<string>('');
  readonly openId = signal<string | null>('size');

  readonly filteredItems = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.faqItems;
    return this.faqItems.filter((item) =>
      `${item.question} ${item.answer}`.toLowerCase().includes(q)
    );
  });

  toggleItem(id: string): void {
    this.openId.update((curr) => (curr === id ? null : id));
  }
}
