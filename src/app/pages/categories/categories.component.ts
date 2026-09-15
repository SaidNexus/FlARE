import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { LangService } from '../../core/services/lang/lang.service';
import { CategoriesPageConfigService } from '../../core/services/page-configs/categories-page-config.service';

interface CategoryUIProps {
  accent: string;
  description: string;
  image: string;
  imageAlt: string;
  path: string;
  imagePosition: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  protected readonly langService = inject(LangService);
  private readonly configService = inject(CategoriesPageConfigService);
  readonly pageConfig = this.configService.pageConfig;

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');

  readonly categories = signal<Category[]>([]);
  readonly loading = signal<boolean>(true);

  private readonly uiPropsMap: Record<string, CategoryUIProps> = {
    'shampoo': {
      accent: 'FLARE',
      description: 'شامبوهات خالية من الكبريتات\nلكل احتياجات شعرك',
      image: '/assets/images/categories/hair-icon.png',
      imageAlt: 'شامبوهات فلير',
      path: '/products?category=shampoo',
      imagePosition: 'center center'
    },
    'conditioner': {
      accent: 'وأقنعة',
      description: 'بلسمات وأقنعة\nلشعر ناعم وصحي',
      image: '/assets/images/categories/hair-icon.png',
      imageAlt: 'بلسمات فلير',
      path: '/products?category=conditioner',
      imagePosition: 'center center'
    },
    'hair-oil': {
      accent: 'الشعر',
      description: 'زيوت طبيعية فاخرة\nتغذية وتقوية',
      image: '/assets/images/categories/hair-icon.png',
      imageAlt: 'زيوت شعر فلير',
      path: '/products?category=hair-oil',
      imagePosition: 'center center'
    },
    'hair-mask': {
      accent: 'الشعر',
      description: 'أقنعة كيراتين\nعلاج وترميم عميق',
      image: '/assets/images/categories/hair-icon.png',
      imageAlt: 'أقنعة شعر فلير',
      path: '/products?category=hair-mask',
      imagePosition: 'center center'
    },
    'treatment': {
      accent: 'الشعر',
      description: 'سيرومات وعلاجات\nحلول متخصصة',
      image: '/assets/images/categories/hair-icon.png',
      imageAlt: 'علاجات فلير',
      path: '/products?category=treatment',
      imagePosition: 'center center'
    },
    'scalp-care': {
      accent: 'الرأس',
      description: 'عناية متخصصة\nلفروة رأس صحية',
      image: '/assets/images/categories/hair-icon.png',
      imageAlt: 'عناية فروة الرأس',
      path: '/products?category=scalp-care',
      imagePosition: 'center center'
    }
  };

  ngOnInit(): void {
    this.categoryService.getCategories().then((data: Category[]) => {
      this.categories.set(data);
      this.loading.set(false);
    }).catch(() => {
      this.loading.set(false);
    });
  }

  getCategoryUIProps(slug: string): CategoryUIProps {
    const en = this.isEn();
    const base = this.uiPropsMap[slug] || this.uiPropsMap['shampoo'];
    const confCat = this.pageConfig().categories?.find(c => c.id === slug);
    if (confCat) {
      return {
        ...base,
        accent: en ? (confCat.accentEn || confCat.accentAr || confCat.accent) : (confCat.accentAr || confCat.accent || base.accent),
        description: en ? (confCat.descriptionEn || confCat.descriptionAr || confCat.description) : (confCat.descriptionAr || confCat.description || base.description),
        path: confCat.path || base.path
      };
    }
    return base;
  }

  splitLines(text: string): string[] {
    return text.split('\n');
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('/assets/images/categories/hair-icon.png')) {
      target.src = '/assets/images/categories/hair-icon.png';
    }
  }
}
