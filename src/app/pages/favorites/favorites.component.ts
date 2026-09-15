import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { AppStateService } from '../../core/services/app-state.service';
import { FavoritesPageConfigService } from '../../core/services/page-configs/favorites-page-config.service';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  private readonly productService = inject(ProductService);
  protected readonly appState = inject(AppStateService);
  private readonly configService = inject(FavoritesPageConfigService);
  private readonly langService = inject(LangService);

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');
  readonly currencyLabel = computed(() => this.isEn() ? 'SAR' : 'ر.س');

  readonly pageConfig = this.configService.pageConfig;

  readonly headerTitle = computed(() => (this.isEn() ? this.pageConfig().headerTitleEn : this.pageConfig().headerTitleAr) || this.pageConfig().headerTitle);
  readonly headerSubtitle = computed(() => (this.isEn() ? this.pageConfig().headerSubtitleEn : this.pageConfig().headerSubtitleAr) || this.pageConfig().headerSubtitle);
  readonly emptyStateTitle = computed(() => (this.isEn() ? this.pageConfig().emptyStateTitleEn : this.pageConfig().emptyStateTitleAr) || this.pageConfig().emptyStateTitle);
  readonly emptyStateSubtitle = computed(() => (this.isEn() ? this.pageConfig().emptyStateSubtitleEn : this.pageConfig().emptyStateSubtitleAr) || this.pageConfig().emptyStateSubtitle);
  readonly emptyStateButtonText = computed(() => (this.isEn() ? this.pageConfig().emptyStateButtonTextEn : this.pageConfig().emptyStateButtonTextAr) || this.pageConfig().emptyStateButtonText);

  readonly allProducts = signal<Product[]>([]);
  readonly loading = signal<boolean>(true);

  readonly favoriteProducts = computed(() => {
    const favIds = this.appState.favoriteProductIds();
    return this.allProducts().filter((p) => favIds.includes(p.id));
  });

  ngOnInit(): void {
    this.productService.getProducts().then((all: Product[]) => {
      this.allProducts.set(all);
      this.loading.set(false);
    }).catch(() => {
      this.loading.set(false);
    });
  }

  handleAddToCart(product: Product): void {
    this.appState.addToCart(product, product.sizes?.[0] || '200ml', 1);
    this.appState.showToast(this.isEn() ? 'Product added to cart!' : 'تم إضافة المنتج إلى السلة!');
  }

  removeFavorite(productId: string): void {
    this.appState.removeFavorite(productId);
    this.appState.showToast(this.isEn() ? 'Product removed from favorites' : 'تم حذف المنتج من المفضلة', 'info');
  }

  getProductImage(product: Product): string {
    const img = (product.images && product.images[0]) || '';
    if (!img) return '/assets/images/products/shampoo/shampoo-dandruff.png';
    return img.startsWith('/') || img.startsWith('http') || img.startsWith('data:') ? img : '/' + img;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('/assets/images/products/shampoo/shampoo-dandruff.png')) {
      target.src = '/assets/images/products/shampoo/shampoo-dandruff.png';
    }
  }
}
