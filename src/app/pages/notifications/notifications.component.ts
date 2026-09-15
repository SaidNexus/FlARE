import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { AppStateService } from '../../core/services/app-state.service';
import { NotificationItem } from '../../core/models/notification.model';
import { NotificationsPageConfigService } from '../../core/services/page-configs/notifications-page-config.service';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private notificationService = inject(NotificationService);
  protected appState = inject(AppStateService);
  private configService = inject(NotificationsPageConfigService);
  private langService = inject(LangService);

  readonly isEn = this.langService.isEn;
  readonly pageConfig = this.configService.pageConfig;

  readonly pageTitle = computed(() => (this.isEn() ? this.pageConfig().pageTitleEn : this.pageConfig().pageTitleAr) || this.pageConfig().pageTitle || (this.isEn() ? 'Notifications' : 'الإشعارات'));
  readonly emptyStateTitle = computed(() => (this.isEn() ? this.pageConfig().emptyStateTitleEn : this.pageConfig().emptyStateTitleAr) || this.pageConfig().emptyStateTitle || (this.isEn() ? 'No notifications at this time' : 'لا توجد إشعارات حالياً'));

  notifications: NotificationItem[] = [];
  loading = true;

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  ngOnInit(): void {
    this.notificationService
      .getNotifications()
      .then((data) => {
        this.notifications = data;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  }

  async handleMarkRead(id: string): Promise<void> {
    const updated = await this.notificationService.markRead(id);
    this.notifications = updated;
  }

  async handleMarkAllRead(): Promise<void> {
    const updated = await this.notificationService.markAllRead();
    this.notifications = updated;
    this.appState.showToast(this.isEn() ? 'All marked as read!' : 'تم تعليم الكل كمقروءة!');
  }

  async handleClear(): Promise<void> {
    const updated = await this.notificationService.clear();
    this.notifications = updated;
    this.appState.showToast(this.isEn() ? 'All notifications cleared!' : 'تم حذف جميع الإشعارات!');
  }

  getTypeIcon(type?: string): string {
    switch (type) {
      case 'order':
        return '📦';
      case 'offer':
        return '🏷️';
      case 'chat':
        return '💬';
      default:
        return '🔔';
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(this.isEn() ? 'en-US' : 'ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

