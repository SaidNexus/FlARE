import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'>('primary');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly loading = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly customClass = input<string>('');

  get variantClass(): string {
    switch (this.variant()) {
      case 'secondary':
        return 'bg-neutral-100 text-neutral-800 font-medium hover:bg-neutral-200 active:scale-[0.98]';
      case 'outline':
        return 'border border-neutral-300 text-neutral-800 font-medium hover:bg-neutral-100 active:scale-[0.98] bg-transparent';
      case 'ghost':
        return 'text-neutral-800 font-medium hover:bg-neutral-100 active:scale-[0.98] bg-transparent';
      case 'danger':
        return 'bg-flare-red text-white font-semibold hover:bg-flare-red active:scale-[0.98]';
      case 'primary':
      default:
        return 'bg-flare-gold text-white font-semibold hover:bg-flare-gold-dark active:scale-[0.98] shadow-sm';
    }
  }

  get sizeClass(): string {
    switch (this.size()) {
      case 'sm':
        return 'h-8 px-3 text-sm rounded-lg';
      case 'lg':
        return 'h-12 px-6 text-base rounded-xl';
      case 'xl':
        return 'h-14 px-8 text-base rounded-2xl';
      case 'md':
      default:
        return 'h-10 px-4 text-sm rounded-xl';
    }
  }
}
