import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '../../core/services/lang/lang.service';
import { PoliciesPageConfigService } from '../../core/services/page-configs/policies-page-config.service';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css',
})
export class PoliciesComponent {
  private readonly configService = inject(PoliciesPageConfigService);
  protected readonly langService = inject(LangService);
  readonly pageConfig = this.configService.pageConfig;

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');
}
