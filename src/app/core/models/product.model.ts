export interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  badge?: string;
  hairType: string[];
  concern: string;
  images: string[];
  reviews?: Review[];
  relatedProducts?: Product[];
}

export interface Review {
  id: string;
  productId: string;
  customer: string;
  rating: number;
  text: string;
  date: string;
  approved: boolean;
}

export interface HomeCategoryItem {
  id: string;
  label: string;
  labelAr?: string;
  labelEn?: string;
  image: string;
  path: string;
}

export interface HomeProductItem {
  id: string;
  productId: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  discount?: number;
}
