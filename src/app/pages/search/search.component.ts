import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { AppStateService } from '../../core/services/app-state.service';
import { SearchPageConfigService } from '../../core/services/page-configs/search-page-config.service';
import { LangService } from '../../core/services/lang.service';

const HISTORY_KEY = 'flare-search-history';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  private readonly productService = inject(ProductService);
  protected readonly appState = inject(AppStateService);
  private readonly configService = inject(SearchPageConfigService);
  private readonly langService = inject(LangService);

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');
  readonly currencyLabel = computed(() => this.isEn() ? 'SAR' : 'ر.س');

  readonly pageConfig = this.configService.pageConfig;

  readonly searchPlaceholder = computed(() => (this.isEn() ? this.pageConfig().searchPlaceholderEn : this.pageConfig().searchPlaceholderAr) || this.pageConfig().searchPlaceholder);
  readonly quickSuggestionsTitle = computed(() => (this.isEn() ? this.pageConfig().quickSuggestionsTitleEn : this.pageConfig().quickSuggestionsTitleAr) || this.pageConfig().quickSuggestionsTitle);
  readonly recentSearchTitle = computed(() => (this.isEn() ? this.pageConfig().recentSearchTitleEn : this.pageConfig().recentSearchTitleAr) || this.pageConfig().recentSearchTitle);
  readonly noResultsTitle = computed(() => (this.isEn() ? this.pageConfig().noResultsTitleEn : this.pageConfig().noResultsTitleAr) || this.pageConfig().noResultsTitle);
  readonly noResultsSubtitle = computed(() => (this.isEn() ? this.pageConfig().noResultsSubtitleEn : this.pageConfig().noResultsSubtitleAr) || this.pageConfig().noResultsSubtitle);

  readonly query = signal<string>('');
  readonly results = signal<Product[]>([]);
  readonly loading = signal<boolean>(false);
  readonly searched = signal<boolean>(false);
  readonly history = signal<string[]>([]);

  readonly popularTerms: string[] = [
    'شامبو بروتين',
    'زيت الأرغان',
    'علاج تساقط الشعر',
    'سيروم اللمعان',
    'بلسم مرطب'
  ];

  ngOnInit(): void {
    try {
      const s = localStorage.getItem(HISTORY_KEY);
      if (s) {
        this.history.set(JSON.parse(s));
      }
    } catch {
      this.history.set([]);
    }
  }

  handleSearch(term?: string): void {
    const q = (term ?? this.query()).trim();
    if (!q) return;

    if (term) {
      this.query.set(term);
    }

    this.loading.set(true);
    this.searched.set(true);

    this.productService.searchProducts(q).then((found: Product[]) => {
      this.results.set(found);
      this.loading.set(false);

      const currentHist = this.history();
      const updated = [q, ...currentHist.filter((x) => x !== q)].slice(0, 10);
      this.history.set(updated);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {}
    }).catch(() => {
      this.results.set([]);
      this.loading.set(false);
    });
  }

  clearHistory(): void {
    this.history.set([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {}
  }

  handleAddToCart(product: Product): void {
    this.appState.addToCart(product, product.sizes?.[0] || '200ml', 1);
    this.appState.showToast(this.isEn() ? 'Product added to cart!' : 'تم إضافة المنتج إلى السلة!');
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
