import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { AppStateService } from '../../core/services/app-state.service';
import { LangService } from '../../core/services/lang/lang.service';
import { ProductPageConfigService } from '../../core/services/page-configs/product-page-config.service';

interface CustomerReview {
  name: string;
  meta: string;
  comment: string;
}

interface RatingRow {
  value: number;
  width: number;
  count: number;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  protected readonly appState = inject(AppStateService);
  protected readonly langService = inject(LangService);
  private readonly configService = inject(ProductPageConfigService);
  readonly pageConfig = this.configService.pageConfig;

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');
  readonly currencyLabel = computed(() => (this.isEn() ? 'SAR' : 'ر.س'));

  readonly product = signal<Product | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly activeImage = signal<number>(0);
  readonly selectedSize = signal<string>('');
  readonly quantity = signal<number>(1);
  readonly activeTab = signal<string>('description');

  readonly customerReviews = computed<CustomerReview[]>(() => {
    const en = this.isEn();
    return [
      {
        name: en ? 'Sarah M.' : 'سارة',
        meta: en ? 'Verified Buyer' : 'مشتري مؤكد',
        comment: en ? 'Amazing product, improved my hair drastically from first use!' : 'منتج رائع جداً واستفدت منه كثير',
      },
      {
        name: en ? 'Noura K.' : 'نورة',
        meta: en ? 'Verified Buyer' : 'مشتري مؤكد',
        comment: en ? 'Incredible results, gentle on scalp and smells wonderful.' : 'يجنن يعطي نتيجة من أول استخدام',
      },
      {
        name: en ? 'Um Khaled' : 'أم خالد',
        meta: en ? 'Verified Buyer' : 'مشتري مؤكد',
        comment: en ? 'Highly recommended! Essential part of my hair routine.' : 'أنصح فيه وبقوة',
      },
    ];
  });

  readonly ratingRows: RatingRow[] = [
    { value: 5, width: 80, count: 180 },
    { value: 4, width: 15, count: 40 },
    { value: 3, width: 3, count: 8 },
    { value: 2, width: 1, count: 2 },
    { value: 1, width: 1, count: 1 },
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.error.set(this.isEn() ? 'Product not found' : 'المنتج غير موجود');
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.productService.getProduct(id).then((data: Product) => {
        this.product.set(data);
        if (data && data.sizes?.length) {
          this.selectedSize.set(data.sizes[0]);
        }
        this.loading.set(false);
      }).catch(() => {
        this.error.set(this.isEn() ? 'Product not found' : 'المنتج غير موجود');
        this.loading.set(false);
      });
    });
  }

  readonly images = computed(() => {
    const raw = this.product()?.images;
    if (!raw || raw.length === 0) {
      return ['/assets/images/products/shampoo/shampoo-dandruff.png'];
    }
    return raw.map((img) => {
      if (!img) return '/assets/images/products/shampoo/shampoo-dandruff.png';
      return img.startsWith('/') || img.startsWith('http') || img.startsWith('data:') ? img : '/' + img;
    });
  });

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('/assets/images/products/shampoo/shampoo-dandruff.png')) {
      target.src = '/assets/images/products/shampoo/shampoo-dandruff.png';
    }
  }

  readonly isWishlist = computed(() => {
    const prod = this.product();
    return prod ? this.appState.isFavorite(prod.id) : false;
  });

  readonly displayDiscount = computed(() => {
    const prod = this.product();
    if (!prod || !prod.originalPrice || prod.originalPrice <= prod.price) return 0;
    return Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);
  });

  selectImage(index: number): void {
    this.activeImage.set(index);
  }

  previousImage(): void {
    const len = this.images().length;
    if (len > 0) {
      this.activeImage.update((curr) => (curr - 1 + len) % len);
    }
  }

  nextImage(): void {
    const len = this.images().length;
    if (len > 0) {
      this.activeImage.update((curr) => (curr + 1) % len);
    }
  }

  addCurrentProduct(): void {
    const prod = this.product();
    if (!prod) return;
    this.appState.addToCart(prod, this.selectedSize(), this.quantity());
    this.appState.showToast(this.isEn() ? 'Product added to cart' : 'تمت إضافة المنتج إلى السلة');
  }

  buyNow(): void {
    this.addCurrentProduct();
    this.router.navigateByUrl('/checkout');
  }

  scrollToSection(sectionId: string): void {
    this.activeTab.set(sectionId);
    document.getElementById(`lk-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleCurrentFavorite(): void {
    const prod = this.product();
    if (!prod) return;
    const current = this.isWishlist();
    this.appState.toggleFavorite(prod.id);
    const msg = current
      ? (this.isEn() ? 'Product removed from favorites' : 'تم حذف المنتج من المفضلة')
      : (this.isEn() ? 'Product added to favorites' : 'تمت إضافة المنتج إلى المفضلة');
    this.appState.showToast(msg, 'info');
  }

  floorRating(rating: number): number {
    return Math.floor(rating || 5);
  }
}
