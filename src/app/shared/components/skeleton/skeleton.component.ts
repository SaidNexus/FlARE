import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css'
})
export class SkeletonComponent {
  readonly type = input<'box' | 'product-card' | 'table-row' | 'order-card' | 'grid'>('box');
  readonly customClass = input<string>('');
  readonly count = input<number>(4);

  get countArray(): number[] {
    return Array.from({ length: this.count() }, (_, i) => i);
  }
}
