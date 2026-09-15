import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-offer-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './offer-banner.component.html',
  styleUrl: './offer-banner.component.css'
})
export class OfferBannerComponent {
  @Input() config?: any;

  get bannerImage(): string {
    let img = this.config?.image;
    if (!img || img.includes('products-banner.png')) {
      img = '/assets/images/covers/concer-banner.png';
    }
    return img.startsWith('/') || img.startsWith('http') || img.startsWith('data:') ? img : '/' + img;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('/assets/images/covers/concer-banner.png')) {
      target.src = '/assets/images/covers/concer-banner.png';
    }
  }
}
