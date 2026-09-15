import { HomeCategoryItem, HomeProductItem } from '../models/product.model';

export type HomeProductCardItem = HomeProductItem;

const categoryIcon = '/assets/images/categories/hair-icon.png';
const productShampoo = '/assets/images/products/shampoo/shampoo-dandruff.png';
const productTemp = '/assets/images/products/shampoo/temp.png';

export const homeCategories: HomeCategoryItem[] = [
  {
    id: 'shampoo',
    label: 'شامبوهات',
    labelAr: 'شامبوهات',
    labelEn: 'Shampoos',
    image: categoryIcon,
    path: '/products?category=shampoo',
  },
  {
    id: 'conditioner',
    label: 'بلسمات',
    labelAr: 'بلسمات',
    labelEn: 'Conditioners',
    image: categoryIcon,
    path: '/products?category=conditioner',
  },
  {
    id: 'hair-oil',
    label: 'زيوت الشعر',
    labelAr: 'زيوت الشعر',
    labelEn: 'Hair Oils',
    image: categoryIcon,
    path: '/products?category=hair-oil',
  },
  {
    id: 'treatment',
    label: 'علاجات',
    labelAr: 'علاجات',
    labelEn: 'Treatments',
    image: categoryIcon,
    path: '/products?category=treatment',
  },
];

export const homeProducts: HomeProductItem[] = [
  {
    id: 'home-product-1',
    productId: 'prod-1',
    name: 'شامبو مكافح للقشرة',
    nameAr: 'شامبو مكافح للقشرة',
    nameEn: 'Anti-Dandruff Shampoo',
    image: productShampoo,
    price: 49.99,
    oldPrice: 79.99,
    rating: 4.8,
    reviews: 237,
    discount: 37,
  },
  {
    id: 'home-product-2',
    productId: 'prod-2',
    name: 'بلسم مكثف للترطيب',
    nameAr: 'بلسم مكثف للترطيب',
    nameEn: 'Intense Moisture Conditioner',
    image: productTemp,
    price: 64.99,
    oldPrice: 89.99,
    rating: 4.6,
    reviews: 184,
  },
  {
    id: 'home-product-3',
    productId: 'prod-3',
    name: 'زيت تحفيز نمو الشعر',
    nameAr: 'زيت تحفيز نمو الشعر',
    nameEn: 'Hair Growth Stimulation Oil',
    image: productShampoo,
    price: 39.99,
    rating: 4.9,
    reviews: 312,
  },
  {
    id: 'home-product-4',
    productId: 'prod-4',
    name: 'قناع إصلاح بروتين الكيراتين',
    nameAr: 'قناع إصلاح بروتين الكيراتين',
    nameEn: 'Keratin Protein Repair Mask',
    image: productTemp,
    price: 44.99,
    oldPrice: 59.99,
    rating: 4.5,
    reviews: 98,
    discount: 25,
  },
  {
    id: 'home-product-5',
    productId: 'prod-7',
    name: 'علاج بزيت الأرغان المغربي',
    nameAr: 'علاج بزيت الأرغان المغربي',
    nameEn: 'Moroccan Argan Oil Treatment',
    image: productShampoo,
    price: 59.99,
    rating: 4.8,
    reviews: 203,
  },
];
