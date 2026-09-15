import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeProductCardItem } from '../../../../core/data/home-page-data';
import { AppStateService } from '../../../../core/services/app-state.service';
import { ProductService } from '../../../../core/services/product.service';
import { LangService } from '../../../../core/services/lang/lang.service';
import { getEnglishTranslation } from '../../../../core/utils/config-sanitizer';

@Component({
  selector: 'app-home-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-product-card.component.html',
  styleUrl: './home-product-card.component.css'
})
export class HomeProductCardComponent {
  readonly item = input.required<HomeProductCardItem>();

  private readonly appState = inject(AppStateService);
  private readonly productService = inject(ProductService);
  public readonly langService = inject(LangService);

  readonly stars = [0, 1, 2, 3, 4];

  get isEn(): boolean {
    return this.langService.storefrontLang() === 'en';
  }

  get displayName(): string {
    const it = this.item();
    if (this.isEn) {
      if (it.nameEn) return it.nameEn;
      const p = this.productService.getProductById(it.productId);
      if (p?.nameEn) return p.nameEn;
      return getEnglishTranslation(it.nameAr || it.name, it.name);
    }
    return it.nameAr || it.name;
  }

  get cardImage(): string {
    const img = this.item()?.image;
    if (!img) return '/assets/images/products/shampoo/shampoo-dandruff.png';
    return img.startsWith('/') || img.startsWith('http') || img.startsWith('data:') ? img : '/' + img;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('/assets/images/products/shampoo/shampoo-dandruff.png')) {
      target.src = '/assets/images/products/shampoo/shampoo-dandruff.png';
    }
  }

  handleAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const currentItem = this.item();
    const sourceProduct = this.productService.getProductById(currentItem.productId);
    if (!sourceProduct) return;

    this.appState.addToCart(sourceProduct, sourceProduct.sizes[0] ?? 'M');
    this.appState.showToast(this.isEn ? 'Added to cart' : 'تمت إضافة المنتج إلى السلة');
  }
}
