import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../core/models/order.model';
import { OrderConfirmationPageConfigService } from '../../core/services/page-configs/order-confirmation-page-config.service';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  private readonly configService = inject(OrderConfirmationPageConfigService);
  private readonly langService = inject(LangService);

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');
  readonly currencyLabel = computed(() => this.isEn() ? 'SAR' : 'ر.س');

  readonly pageConfig = this.configService.pageConfig;

  readonly pageTitle = computed(() => (this.isEn() ? this.pageConfig().pageTitleEn : this.pageConfig().pageTitleAr) || this.pageConfig().pageTitle);
  readonly successMessage = computed(() => (this.isEn() ? this.pageConfig().successMessageEn : this.pageConfig().successMessageAr) || this.pageConfig().successMessage);

  order: Order | null = null;

  constructor(private readonly router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['order']) {
      this.order = nav.extras.state['order'] as Order;
    }
  }

  ngOnInit(): void {
    if (!this.order && typeof history !== 'undefined' && history.state?.order) {
      this.order = history.state.order as Order;
    }
  }
}
