import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { products, categories, reviews } from '../data/mock-data';

export interface ProductFilters {
  category?: string;
  search?: string;
  concern?: string;
  hairType?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    let result = [...products];

    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nameAr.includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.descAr.includes(q)
      );
    }
    if (filters.concern && filters.concern !== 'all') {
      result = result.filter((p) => p.concern === filters.concern);
    }
    if (filters.hairType && filters.hairType !== 'all') {
      result = result.filter((p) => p.hairType.includes(filters.hairType!));
    }
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }

  getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id || p.slug === id);
  }

  async getProduct(id: string): Promise<Product> {
    const product = products.find((p) => p.id === id || p.slug === id);
    if (!product) {
      throw new Error('Product not found');
    }
    const productReviews = reviews.filter(
      (r) => r.productId === product.id && r.approved
    );
    const related = products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    return {
      ...product,
      reviews: productReviews,
      relatedProducts: related,
    };
  }

  async getCategories(): Promise<Category[]> {
    return [...categories];
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.getProducts({ category });
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return products.filter((p) => p.isBestSeller).slice(0, 4);
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.nameAr.includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.descAr.includes(q) ||
        p.category.includes(q)
    );
  }
}
