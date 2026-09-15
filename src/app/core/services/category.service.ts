import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { categories } from '../data/mock-data';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  async getCategories(): Promise<Category[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categories || []);
      }, 100);
    });
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categories.find((c) => c.slug === slug));
      }, 100);
    });
  }
}
