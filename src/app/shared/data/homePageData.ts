export type HomeCategory = {
  id: string;
  label: string;
  image: string;
  path: string;
};

export type HomeProduct = {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  discount?: number;
};

export const homeCategories: HomeCategory[] = [
  {
    id: 'shampoo',
    label: 'شامبو العناية',
    image: '/assets/images/products/shampoo/shampoo-dandruff.png',
    path: '/categories',
  },
  {
    id: 'conditioner',
    label: 'بلسم الترطيب',
    image: '/assets/images/products/shampoo/shampoo-dandruff.png',
    path: '/categories',
  },
  {
    id: 'hair-mask',
    label: 'ماسكات مكثفة',
    image: '/assets/images/products/shampoo/shampoo-dandruff.png',
    path: '/categories',
  },
  {
    id: 'serum',
    label: 'سيروم وزيوت',
    image: '/assets/images/products/shampoo/shampoo-dandruff.png',
    path: '/categories',
  },
];

export const homeProducts: HomeProduct[] = [
  {
    id: 'home-product-1',
    productId: 'prod-1',
    name: 'شامبو مكافح للقشرة - تنظيف عميق',
    image: '/assets/images/products/shampoo/shampoo-dandruff.png',
    price: 49.99,
    oldPrice: 79.99,
    rating: 4.8,
    reviews: 237,
    discount: 37,
  },
  {
    id: 'home-product-2',
    productId: 'prod-2',
    name: 'بلسم مكثف للترطيب العميق',
    image: '/assets/images/products/shampoo/shampoo-dandruff.png',
    price: 64.99,
    oldPrice: 89.99,
    rating: 4.6,
    reviews: 184,
  },
  {
    id: 'home-product-3',
    productId: 'prod-3',
    name: 'قناع الكيراتين لإصلاح الشعر التالف',
    image: '/assets/images/products/shampoo/shampoo-dandruff.png',
    price: 79.99,
    oldPrice: 110.0,
    rating: 4.9,
    reviews: 312,
    discount: 27,
  },
  {
    id: 'home-product-4',
    productId: 'prod-4',
    name: 'سيروم الأرغان الذهبي لتألق فوري',
    image: '/assets/images/products/shampoo/shampoo-dandruff.png',
    price: 89.99,
    oldPrice: 120.0,
    rating: 4.7,
    reviews: 156,
  },
];
