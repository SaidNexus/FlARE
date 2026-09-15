import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent {
  @Input() config?: any;

  get heroImage(): string {
    const img = this.config?.slides?.[0]?.image || this.config?.image || '/assets/covers/hero-model-products.png';
    return img.startsWith('/') || img.startsWith('http') || img.startsWith('data:') ? img : '/' + img;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('/assets/covers/hero-model-products.png')) {
      target.src = '/assets/covers/hero-model-products.png';
    }
  }

  get heroTitle(): string {
    return this.config?.slides?.[0]?.title || this.config?.title || '';
  }
}
