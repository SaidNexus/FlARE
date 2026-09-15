import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { BenefitsBarComponent } from './components/benefits-bar/benefits-bar.component';
import { CategorySectionComponent } from './components/category-section/category-section.component';
import { ProductsSectionComponent } from './components/products-section/products-section.component';
import { OfferBannerComponent } from './components/offer-banner/offer-banner.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';
import { FaqSectionComponent } from './components/faq-section/faq-section.component';
import { HomePageConfigService } from '../../core/services/page-configs/home-page-config.service';
import { PageConfig } from '../../core/models/config.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    BenefitsBarComponent,
    CategorySectionComponent,
    ProductsSectionComponent,
    OfferBannerComponent,
    TestimonialsSectionComponent,
    FaqSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private configService = inject(HomePageConfigService);
  readonly pageConfig: Signal<PageConfig> = this.configService.pageConfig;
}
