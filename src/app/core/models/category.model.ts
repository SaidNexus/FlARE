export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  productCount: number;
  status?: string;
}

export interface CategoryUIProps {
  accent: string;
  description: string;
  image: string;
  imageAlt: string;
  path: string;
  imagePosition: string;
}
