import { Injectable } from '@angular/core';
import { Offer } from '../models/offer.model';
import { Product } from '../models/product.model';
import { products } from '../data/mock-data';

const mockOffers: Offer[] = [
  {
    id: 'off-1',
    title: 'تخفيضات الشامبو',
    titleEn: 'Shampoo Sale',
    description: 'خصم 40% على جميع شامبوهات مكافحة القشرة',
    discount: 40,
    category: 'shampoo',
    validUntil: '2026-09-30',
    badge: '40% OFF',
    isFlash: true,
  },
  {
    id: 'off-2',
    title: 'عرض الزيوت',
    titleEn: 'Oils Bundle',
    description: 'اشترِ 2 زيوت واحصل على الثالث مجاناً',
    discount: 33,
    category: 'hair-oil',
    validUntil: '2026-08-31',
    badge: 'اشتري 2 واحصل على 1 مجاناً',
    isFlash: false,
  },
  {
    id: 'off-3',
    title: 'عرض الأقنعة',
    titleEn: 'Masks Special',
    description: 'خصم 25% على أقنعة الكيراتين',
    discount: 25,
    category: 'hair-mask',
    validUntil: '2026-09-15',
    badge: '25% OFF',
    isFlash: false,
  },
];

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  async getOffers(): Promise<Offer[]> {
    return mockOffers;
  }

  async getOfferProducts(offerId: string): Promise<Product[]> {
    const offer = mockOffers.find((o) => o.id === offerId);
    if (!offer) return [];
    return products.filter((p) => p.category === offer.category);
  }
}
