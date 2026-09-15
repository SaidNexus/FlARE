import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppStateService } from '../../../core/services/app-state.service';
import { Product } from '../../../core/models/product.model';
import { LangService } from '../../../core/services/lang/lang.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  private readonly appState = inject(AppStateService);
  public readonly langService = inject(LangService);

  readonly id = input<string>('');
  readonly image = input<string>('');
  readonly title = input<string>('');
  readonly rating = input<number>(5);
  readonly price = input<number>(0);
  readonly oldPrice = input<number | undefined>(undefined);
  readonly discount = input<number | undefined>(undefined);
  readonly bgColor = input<string>('bg-white');
  readonly product = input<Product | null>(null);

  get isEn(): boolean {
    return this.langService.storefrontLang() === 'en';
  }

  get displayTitle(): string {
    const p = this.product();
    if (p) {
      return this.isEn ? (p.nameEn || p.nameAr) : (p.nameAr || p.nameEn);
    }
    return this.title();
  }

  get cardImage(): string {
    const img = this.image();
    if (!img) return '/assets/images/products/shampoo/shampoo-dandruff.png';
    return img.startsWith('/') || img.startsWith('http') || img.startsWith('data:') ? img : '/' + img;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('/assets/images/products/shampoo/shampoo-dandruff.png')) {
      target.src = '/assets/images/products/shampoo/shampoo-dandruff.png';
    }
  }

  get isFavorite(): boolean {
    return this.appState.isFavorite(this.id());
  }

  get starArray(): number[] {
    return [0, 1, 2, 3, 4];
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.appState.toggleFavorite(this.id());
    this.appState.showToast(
      this.isFavorite 
        ? (this.isEn ? 'Added to wishlist' : 'تمت الإضافة للمفضلة') 
        : (this.isEn ? 'Removed from wishlist' : 'تمت الإزالة من المفضلة'),
      'info'
    );
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const p = this.product();
    if (p) {
      this.appState.addToCart(p, p.sizes?.[0] || '200ml', 1);
      this.appState.showToast('تمت إضافة المنتج إلى السلة!');
    } else {
      // Create minimal product for cart
      const minimalProduct: Product = {
        id: this.id(),
        slug: this.id(),
        nameAr: this.title(),
        nameEn: this.title(),
        descAr: '',
        descEn: '',
        price: this.price(),
        originalPrice: this.oldPrice(),
        category: 'shampoo',
        sizes: ['200ml'],
        stock: 10,
        rating: this.rating(),
        reviewCount: 1,
        hairType: [],
        concern: '',
        images: [this.image()]
      };
      this.appState.addToCart(minimalProduct, '200ml', 1);
      this.appState.showToast('تمت إضافة المنتج إلى السلة!');
    }
  }
}
