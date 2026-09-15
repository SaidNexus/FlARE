import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LangService } from '../../../../core/services/lang/lang.service';

interface Testimonial {
  id: number;
  name: string;
  nameAr: string;
  nameEn: string;
  message: string;
  messageAr: string;
  messageEn: string;
  rating: number;
  avatar: string;
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.css'
})
export class TestimonialsSectionComponent implements OnInit, OnDestroy {
  public readonly langService = inject(LangService);

  get isEn(): boolean {
    return this.langService.storefrontLang() === 'en';
  }

  readonly testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'سارة محمد',
      nameAr: 'سارة محمد',
      nameEn: 'Sarah M.',
      message: 'جودة ممتازة جداً والخامة رائعة والتوصيل سريع، كان كمان سريع جداً',
      messageAr: 'جودة ممتازة جداً والخامة رائعة والتوصيل سريع، كان كمان سريع جداً',
      messageEn: 'Superior quality, amazing formula and ultra fast delivery. Highly recommended!',
      rating: 5,
      avatar: '/assets/images/logo/logo.png',
    },
    {
      id: 2,
      name: 'نورا أحمد',
      nameAr: 'نورا أحمد',
      nameEn: 'Noura A.',
      message: 'المقاس مضبوط والخامة مريحة جداً، والتغليف والتوصيل كانوا ممتازين',
      messageAr: 'المقاس مضبوط والخامة مريحة جداً، والتغليف والتوصيل كانوا ممتازين',
      messageEn: 'Perfect formula, very gentle on hair, and the packaging is truly luxurious.',
      rating: 5,
      avatar: '/assets/images/logo/logo.png',
    },
    {
      id: 3,
      name: 'ريم خالد',
      nameAr: 'ريم خالد',
      nameEn: 'Reem K.',
      message: 'المنتجات شكلها جميل ورائحتها رائعة، وتجربتي مع المتجر ممتازة',
      messageAr: 'المنتجات شكلها جميل ورائحتها رائعة، وتجربتي مع المتجر ممتازة',
      messageEn: 'Smells wonderful and leaves hair visibly shiny and strong. Wonderful experience!',
      rating: 5,
      avatar: '/assets/images/logo/logo.png',
    },
  ];

  readonly activeIndex = signal<number>(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.activeIndex.update((curr) => (curr + 1) % this.testimonials.length);
    }, 4500);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  showPrevious(): void {
    this.activeIndex.update((curr) => (curr - 1 + this.testimonials.length) % this.testimonials.length);
  }

  showNext(): void {
    this.activeIndex.update((curr) => (curr + 1) % this.testimonials.length);
  }

  setIndex(index: number): void {
    this.activeIndex.set(index);
  }

  get activeTestimonial(): Testimonial {
    return this.testimonials[this.activeIndex()];
  }
}
