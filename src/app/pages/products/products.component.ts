import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { AppStateService } from '../../core/services/app-state.service';
import { LangService } from '../../core/services/lang/lang.service';
import { AllShapersPageConfigService } from '../../core/services/page-configs/all-shapers-page-config.service';

interface FilterOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  protected readonly appState = inject(AppStateService);
  protected readonly langService = inject(LangService);
  private readonly configService = inject(AllShapersPageConfigService);
  readonly pageConfig = this.configService.pageConfig;

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');
  readonly currencyLabel = computed(() => (this.isEn() ? 'SAR' : 'ر.س'));

  readonly pageSize = 12;

  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(true);

  readonly activeFilter = signal<'category' | 'concern' | 'price' | null>(null);
  readonly selectedCategory = signal<string>('all');
  readonly selectedConcern = signal<string>('all');
  readonly selectedPrice = signal<string>('all');

  readonly sortMode = signal<'bestseller' | 'latest'>('bestseller');
  readonly viewMode = signal<'grid' | 'list'>('grid');

  readonly currentPage = signal<number>(1);
  readonly showAllProducts = signal<boolean>(false);

  readonly categoryOptions = computed<FilterOption[]>(() => {
    const en = this.isEn();
    return [
      { value: 'all', label: en ? 'All Products' : 'كل المنتجات' },
      { value: 'shampoo', label: en ? 'Shampoo' : 'شامبو' },
      { value: 'conditioner', label: en ? 'Conditioner' : 'بلسم' },
      { value: 'hair-mask', label: en ? 'Hair Masks' : 'أقنعة الشعر' },
      { value: 'hair-oil', label: en ? 'Hair Oils' : 'زيوت الشعر' },
    ];
  });

  readonly concernOptions = computed<FilterOption[]>(() => {
    const en = this.isEn();
    return [
      { value: 'all', label: en ? 'All Concerns' : 'الكل' },
      { value: 'dandruff', label: en ? 'Dandruff' : 'قشرة الرأس' },
      { value: 'dry', label: en ? 'Dry Hair' : 'جفاف الشعر' },
      { value: 'damage', label: en ? 'Damage' : 'التلف' },
      { value: 'hair-fall', label: en ? 'Hair Fall' : 'تساقط الشعر' },
    ];
  });

  readonly priceOptions = computed<FilterOption[]>(() => {
    const en = this.isEn();
    return [
      { value: 'all', label: en ? 'All Prices' : 'الكل' },
      { value: 'under-50', label: en ? 'Under 50 SAR' : 'أقل من 50 ر.س' },
      { value: '50-100', label: en ? '50 - 100 SAR' : '50 - 100 ر.س' },
      { value: 'over-100', label: en ? 'Over 100 SAR' : 'أكثر من 100 ر.س' },
    ];
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const cat = params.get('category') || 'all';
      this.selectedCategory.set(cat);
    });

    this.productService.getProducts().then((data: Product[]) => {
      this.products.set(data);
      this.loading.set(false);
    });
  }

  readonly selectedCategoryLabel = computed(() => {
    return this.categoryOptions().find((o) => o.value === this.selectedCategory())?.label || (this.isEn() ? 'Category' : 'الفئة');
  });

  readonly selectedConcernLabel = computed(() => {
    return this.concernOptions().find((o) => o.value === this.selectedConcern())?.label || (this.isEn() ? 'Concern' : 'المشكلة');
  });

  readonly selectedPriceLabel = computed(() => {
    return this.priceOptions().find((o) => o.value === this.selectedPrice())?.label || (this.isEn() ? 'Price' : 'السعر');
  });

  readonly filteredItems = computed(() => {
    const list = this.products();
    const cat = this.selectedCategory();
    const con = this.selectedConcern();
    const price = this.selectedPrice();

    return list.filter((item) => {
      if (cat !== 'all' && item.category !== cat) return false;
      if (con !== 'all' && (!item.concern || item.concern !== con)) return false;
      if (price !== 'all') {
        if (price === 'under-50' && item.price >= 50) return false;
        if (price === '50-100' && (item.price < 50 || item.price > 100)) return false;
        if (price === 'over-100' && item.price <= 100) return false;
      }
      return true;
    });
  });

  readonly sortedItems = computed(() => {
    const items = [...this.filteredItems()];
    const mode = this.sortMode();
    return items.sort((a, b) => {
      if (mode === 'bestseller') {
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      } else {
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      }
    });
  });

  readonly totalPages = computed(() => {
    return Math.ceil(this.sortedItems().length / this.pageSize);
  });

  readonly visibleItems = computed(() => {
    if (this.showAllProducts()) return this.sortedItems();
    const page = this.currentPage();
    return this.sortedItems().slice((page - 1) * this.pageSize, page * this.pageSize);
  });

  readonly pageNumbers = computed(() => {
    const count = this.totalPages();
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  readonly hasActiveFilters = computed(() => {
    return (
      this.selectedCategory() !== 'all' ||
      this.selectedPrice() !== 'all' ||
      this.selectedConcern() !== 'all'
    );
  });

  toggleActiveFilter(filter: 'category' | 'concern' | 'price'): void {
    this.activeFilter.update((curr) => (curr === filter ? null : filter));
  }

  resetFilters(): void {
    this.selectedCategory.set('all');
    this.selectedPrice.set('all');
    this.selectedConcern.set('all');
    this.activeFilter.set(null);
    this.currentPage.set(1);
  }

  onAddToCart(item: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.appState.addToCart(item, item.sizes?.[0] || '200ml', 1);
    this.appState.showToast(this.isEn() ? 'Added to cart!' : 'تمت الإضافة للسلة!');
  }

  onToggleFavorite(item: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const isFav = this.appState.isFavorite(item.id);
    this.appState.toggleFavorite(item.id);
    const msg = isFav
      ? (this.isEn() ? 'Product removed from favorites' : 'تم حذف المنتج من المفضلة')
      : (this.isEn() ? 'Product added to favorites' : 'تمت إضافة المنتج إلى المفضلة');
    this.appState.showToast(msg, 'info');
  }

  floorRating(rating: number): number {
    return Math.floor(rating);
  }

  getProductImage(item: Product): string {
    const img = (item.images && item.images[0]) || '';
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
