import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsPageConfigService } from '../../../../../core/services/page-configs/notifications-page-config.service';
import { BilingualInputComponent } from '../../components/bilingual-input/bilingual-input.component';

@Component({
  selector: 'app-notifications-page-editor',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule, BilingualInputComponent],
  templateUrl: './notifications-page-editor.component.html',
  styles: ``
})
export class NotificationsPageEditorComponent {
  private configService = inject(NotificationsPageConfigService);
  
  config = this.configService.pageConfig;

  updateConfig(key: string, value: any) {
    this.configService.updateConfig({
      ...this.config(),
      [key]: value
    });
  }

  updateBilingualField(fieldPrefix: string, lang: 'Ar' | 'En', value: string) {
    const key = `${fieldPrefix}${lang}`;
    const updates: Record<string, any> = { [key]: value };
    if (lang === 'Ar') {
      updates[fieldPrefix] = value;
    }
    this.configService.updateConfig({ ...this.config(), ...updates });
  }
}

