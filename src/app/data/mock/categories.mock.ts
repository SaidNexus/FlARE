import { Category } from '../../domain/models/category.model';

export const categories: Category[] = [
  { id: 'cat-shampoo', slug: 'shampoo', nameEn: 'Shampoos', nameAr: 'شامبوهات', image: '/assets/images/categories/hair-icon.png', productCount: 18 },
  { id: 'cat-conditioner', slug: 'conditioner', nameEn: 'Conditioners', nameAr: 'بلسمات', image: '/assets/images/categories/hair-icon.png', productCount: 12 },
  { id: 'cat-hair-mask', slug: 'hair-mask', nameEn: 'Hair Masks', nameAr: 'أقنعة الشعر', image: '/assets/images/categories/hair-icon.png', productCount: 10 },
  { id: 'cat-hair-oil', slug: 'hair-oil', nameEn: 'Hair Oils', nameAr: 'زيوت الشعر', image: '/assets/images/categories/hair-icon.png', productCount: 15 },
  { id: 'cat-treatment', slug: 'treatment', nameEn: 'Treatments', nameAr: 'علاجات', image: '/assets/images/categories/hair-icon.png', productCount: 8 },
  { id: 'cat-scalp-care', slug: 'scalp-care', nameEn: 'Scalp Care', nameAr: 'العناية بفروة الرأس', image: '/assets/images/categories/hair-icon.png', productCount: 9 }
];
