import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService, Toast } from '../../../core/services/app-state.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastContainerComponent {
  protected readonly appState = inject(AppStateService);

  dismiss(id: string): void {
    this.appState.dismissToast(id);
  }
}
