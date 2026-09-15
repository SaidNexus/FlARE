import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';
import { AppStateService } from '../../core/services/app-state.service';
import { MyOrdersPageConfigService } from '../../core/services/page-configs/my-orders-page-config.service';
import { LangService } from '../../core/services/lang.service';

interface TimelineStep {
  id: string;
  label: string;
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  protected readonly appState = inject(AppStateService);
  private readonly configService = inject(MyOrdersPageConfigService);
  private readonly langService = inject(LangService);

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');
  readonly currencyLabel = computed(() => this.isEn() ? 'SAR' : 'ر.س');

  readonly pageConfig = this.configService.pageConfig;

  readonly headerTitle = computed(() => (this.isEn() ? this.pageConfig().headerTitleEn : this.pageConfig().headerTitleAr) || this.pageConfig().headerTitle);
  readonly headerSubtitle = computed(() => (this.isEn() ? this.pageConfig().headerSubtitleEn : this.pageConfig().headerSubtitleAr) || this.pageConfig().headerSubtitle);
  readonly emptyTitle = computed(() => (this.isEn() ? this.pageConfig().emptyTitleEn : this.pageConfig().emptyTitleAr) || this.pageConfig().emptyTitle);
  readonly emptyText = computed(() => (this.isEn() ? this.pageConfig().emptyTextEn : this.pageConfig().emptyTextAr) || this.pageConfig().emptyText);
  readonly emptyCta = computed(() => (this.isEn() ? this.pageConfig().emptyCtaEn : this.pageConfig().emptyCtaAr) || this.pageConfig().emptyCta);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly expandedOrderId = signal<string | null>(null);

  readonly timelineSteps = computed<TimelineStep[]>(() => [
    { id: 'pending', label: this.isEn() ? 'Order Placed' : 'تم إنشاء الطلب' },
    { id: 'confirmed', label: this.isEn() ? 'Confirmed' : 'تم تأكيد الطلب' },
    { id: 'processing', label: this.isEn() ? 'Processing' : 'جاري التجهيز' },
    { id: 'shipped', label: this.isEn() ? 'Shipped' : 'تم الشحن' },
    { id: 'delivered', label: this.isEn() ? 'Delivered' : 'تم التسليم' },
  ]);

  private get statusMap(): Record<string, { label: string; stepIndex: number }> {
    return {
      pending: { label: this.isEn() ? 'Pending' : 'قيد الانتظار', stepIndex: 0 },
      confirmed: { label: this.isEn() ? 'Confirmed' : 'مؤكد', stepIndex: 1 },
      processing: { label: this.isEn() ? 'Processing' : 'جارٍ التجهيز', stepIndex: 2 },
      shipped: { label: this.isEn() ? 'Shipped' : 'تم الشحن', stepIndex: 3 },
      delivered: { label: this.isEn() ? 'Delivered' : 'تم التسليم', stepIndex: 4 },
      cancelled: { label: this.isEn() ? 'Cancelled' : 'ملغى', stepIndex: -1 },
    };
  }

  ngOnInit(): void {
    const userId = this.appState.user()?.id || 'guest-demo';
    this.orderService.getMyOrders(userId).then((data: Order[]) => {
      this.orders.set(data);
      this.loading.set(false);
    }).catch(() => {
      this.error.set(this.isEn() ? 'Could not load orders.' : 'تعذّر تحميل الطلبيات.');
      this.loading.set(false);
    });
  }

  toggleExpand(orderId: string): void {
    this.expandedOrderId.update((curr) => (curr === orderId ? null : orderId));
  }

  getStatusInfo(status: string) {
    return this.statusMap[status] || { label: status, stepIndex: 0 };
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border border-amber-200/50';
      case 'confirmed': return 'bg-slate-100 text-slate-900 border border-blue-200/50';
      case 'processing': return 'bg-indigo-50 text-indigo-600 border border-indigo-200/50';
      case 'shipped': return 'bg-purple-50 text-purple-600 border border-purple-200/50';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border border-emerald-200/50';
      case 'cancelled': return 'bg-flare-red/10 text-flare-red border border-flare-red/50';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  timelineWidth(stepIndex: number): string {
    return `${(Math.max(0, stepIndex) / (this.timelineSteps().length - 1)) * 100}%`;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('/assets/images/products/shampoo/shampoo-dandruff.png')) {
      target.src = '/assets/images/products/shampoo/shampoo-dandruff.png';
    }
  }
}
