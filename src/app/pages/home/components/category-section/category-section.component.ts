import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { homeCategories } from '../../../../core/data/home-page-data';
import { LangService } from '../../../../core/services/lang/lang.service';
import { getEnglishTranslation } from '../../../../core/utils/config-sanitizer';

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-section.component.html',
  styleUrl: './category-section.component.css'
})
export class CategorySectionComponent {
  @Input() config?: any;
  public readonly langService = inject(LangService);

  readonly defaultCategories = homeCategories;

  get isEn(): boolean {
    return this.langService.storefrontLang() === 'en';
  }

  get title(): string {
    if (this.isEn) {
      return this.config?.titleEn || getEnglishTranslation(this.config?.titleAr || this.config?.title || '', 'Shop by Category');
    }
    return this.config?.titleAr || this.config?.title || 'تسوق حسب الفئة';
  }

  get showTitle(): boolean {
    return this.config?.showTitle !== false;
  }

  get categories(): any[] {
    if (this.config?.categories && Array.isArray(this.config.categories) && this.config.categories.length > 0) {
      return this.config.categories.map((c: any) => {
        let img = c.image || '/assets/images/categories/hair-icon.png';
        if (img && !img.startsWith('/') && !img.startsWith('http') && !img.startsWith('data:')) {
          img = '/' + img;
        }
        const rawAr = c.nameAr || c.label || c.name || '';
        const label = this.isEn
          ? (c.nameEn || c.labelEn || getEnglishTranslation(rawAr, rawAr))
          : rawAr;
        return {
          id: c.id,
          label,
          image: img,
          path: c.path || `/products?category=${c.id}`
        };
      });
    }
    return this.defaultCategories.map(c => ({
      ...c,
      label: this.isEn ? ((c as any).labelEn || (c as any).nameEn || getEnglishTranslation(c.label, c.label)) : c.label
    }));
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('/assets/images/categories/hair-icon.png')) {
      target.src = '/assets/images/categories/hair-icon.png';
    }
  }
}
