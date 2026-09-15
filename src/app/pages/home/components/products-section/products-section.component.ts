import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { homeProducts } from '../../../../core/data/home-page-data';
import { HomeProductCardComponent } from '../home-product-card/home-product-card.component';
import { HomeProductItem } from '../../../../core/models/product.model';
import { LangService } from '../../../../core/services/lang/lang.service';
import { ProductService } from '../../../../core/services/product.service';
import { getEnglishTranslation } from '../../../../core/utils/config-sanitizer';

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule, RouterLink, HomeProductCardComponent],
  templateUrl: './products-section.component.html',
  styleUrl: './products-section.component.css'
})
export class ProductsSectionComponent {
  @Input() config?: any;
  public readonly langService = inject(LangService);
  private readonly productService = inject(ProductService);

  readonly defaultProducts = homeProducts;

  get isEn(): boolean {
    return this.langService.storefrontLang() === 'en';
  }

  get title(): string {
    if (this.isEn) {
      return this.config?.titleEn || getEnglishTranslation(this.config?.titleAr || this.config?.title || '', 'Bestsellers');
    }
    return this.config?.titleAr || this.config?.title || 'الأكثر مبيعاً';
  }

  get showTitle(): boolean {
    return this.config?.showTitle !== false;
  }

  get products(): HomeProductItem[] {
    if (this.config?.products && Array.isArray(this.config.products) && this.config.products.length > 0) {
      return this.config.products.map((p: any, idx: number) => {
        let img = p.image || '/assets/images/products/shampoo/shampoo-dandruff.png';
        if (img && !img.startsWith('/') && !img.startsWith('http') && !img.startsWith('data:')) {
          img = '/' + img;
        }
        const rawAr = p.nameAr || p.name || '';
        const prod = this.productService.getProductById(p.productId || p.id);
        const name = this.isEn
          ? (p.nameEn || prod?.nameEn || getEnglishTranslation(rawAr, rawAr))
          : rawAr;
        return {
          id: p.id || `prod-${idx}`,
          productId: p.productId || p.id || `prod-${idx}`,
          name,
          image: img,
          price: Number(p.price) || 49.99,
          oldPrice: p.oldPrice || p.originalPrice || undefined,
          rating: p.rating || 4.8,
          reviews: p.reviews || p.reviewsCount || 150,
          discount: p.discount ? Number(String(p.discount).replace(/[^0-9]/g, '')) : undefined
        };
      });
    }
    return this.defaultProducts.map(p => ({
      ...p,
      name: this.isEn ? (p.nameEn || p.name) : (p.nameAr || p.name)
    }));
  }
}
