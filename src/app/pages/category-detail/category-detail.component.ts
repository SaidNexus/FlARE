import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { AppStateService } from '../../core/services/app-state.service';
import { CategoryPageConfigService } from '../../core/services/page-configs/category-page-config.service';
import { LangService } from '../../core/services/lang.service';

const CATEGORY_NAMES_AR: Record<string, string> = {
  'shampoo': 'شامبوهات',
  'conditioner': 'بلسمات',
  'hair-mask': 'أقنعة الشعر',
  'hair-oil': 'زيوت الشعر',
  'treatment': 'علاجات',
  'scalp-care': 'العناية بفروة الرأس',
};

const CATEGORY_NAMES_EN: Record<string, string> = {
  'shampoo': 'Shampoos',
  'conditioner': 'Conditioners',
  'hair-mask': 'Hair Masks',
  'hair-oil': 'Hair Oils',
  'treatment': 'Treatments',
  'scalp-care': 'Scalp Care',
};

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  protected readonly appState = inject(AppStateService);
  private readonly configService = inject(CategoryPageConfigService);
  private readonly langService = inject(LangService);

  readonly isEn = this.langService.isEn;
  readonly pageConfig = this.configService.pageConfig;

  readonly slug = signal<string>('');
  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly categoryName = computed(() => {
    const s = this.slug();
    return (this.isEn() ? CATEGORY_NAMES_EN[s] : CATEGORY_NAMES_AR[s]) || s;
  });

  readonly currencyLabel = computed(() => (this.isEn() ? 'SAR' : 'ر.س'));

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const s = params.get('slug') || '';
      this.slug.set(s);
      this.loading.set(true);

      this.productService.getProductsByCategory(s).then((result: Product[]) => {
        this.products.set(result);
        this.loading.set(false);
      }).catch(() => {
        this.error.set(this.isEn() ? 'An error occurred while loading products.' : 'حدث خطأ في تحميل المنتجات.');
        this.loading.set(false);
      });
    });
  }

  handleAddToCart(event: Event, product: Product): void {
    event.preventDefault();
    event.stopPropagation();
    this.appState.addToCart(product, product.sizes?.[0] || '200ml', 1);
    this.appState.showToast(this.isEn() ? 'Product added to cart!' : 'تم إضافة المنتج إلى السلة!');
  }

  toggleFav(event: Event, productId: string): void {
    event.preventDefault();
    event.stopPropagation();
    const isFav = this.appState.isFavorite(productId);
    this.appState.toggleFavorite(productId);
    this.appState.showToast(
      isFav
        ? (this.isEn() ? 'Removed from favorites' : 'تم حذف المنتج من المفضلة')
        : (this.isEn() ? 'Added to favorites' : 'تمت إضافة المنتج إلى المفضلة'),
      'info'
    );
  }
}

