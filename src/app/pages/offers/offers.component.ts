import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Offer } from '../../core/models/offer.model';
import { Product } from '../../core/models/product.model';
import { OfferService } from '../../core/services/offer.service';
import { ProductService } from '../../core/services/product.service';
import { AppStateService } from '../../core/services/app-state.service';
import { LangService } from '../../core/services/lang/lang.service';
import { OffersPageConfigService } from '../../core/services/page-configs/offers-page-config.service';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent implements OnInit {
  private readonly offerService = inject(OfferService);
  private readonly productService = inject(ProductService);
  protected readonly appState = inject(AppStateService);
  protected readonly langService = inject(LangService);
  private readonly configService = inject(OffersPageConfigService);
  readonly pageConfig = this.configService.pageConfig;

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');
  readonly currencyLabel = computed(() => (this.isEn() ? 'SAR' : 'ر.س'));

  readonly offers = signal<Offer[]>([]);
  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(true);
  readonly activeOffer = signal<string | null>(null);

  readonly offerProducts = computed(() => {
    const active = this.activeOffer();
    if (!active) return [];
    const currentOffer = this.offers().find((o) => o.id === active);
    if (!currentOffer) return [];
    return this.products().filter((p) => p.category === currentOffer.category);
  });

  async ngOnInit(): Promise<void> {
    try {
      const offersData = await this.offerService.getOffers();
      this.offers.set(offersData);
      if (offersData.length > 0) {
        this.activeOffer.set(offersData[0].id);
      }
      const prodData = await this.productService.getProducts();
      this.products.set(prodData);
    } catch {
      // Handle error
    } finally {
      this.loading.set(false);
    }
  }

  setActiveOffer(id: string): void {
    this.activeOffer.set(id);
  }

  handleAddToCart(product: Product): void {
    this.appState.addToCart(product, product.sizes?.[0] || '200ml', 1);
    this.appState.showToast(this.isEn() ? 'Added to cart!' : 'تم إضافة المنتج إلى السلة!');
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
