import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css'
})
export class BadgeComponent {
  readonly variant = input<'primary' | 'success' | 'warning' | 'danger' | 'muted' | 'outline'>('primary');
  readonly size = input<'sm' | 'md'>('md');
  readonly customClass = input<string>('');

  get variantClass(): string {
    switch (this.variant()) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'danger':
        return 'bg-flare-red/10 text-flare-red';
      case 'muted':
        return 'bg-neutral-100 text-neutral-600';
      case 'outline':
        return 'border border-neutral-200 text-neutral-600 bg-transparent';
      case 'primary':
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  }

  get sizeClass(): string {
    return this.size() === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2.5 py-1';
  }
}
