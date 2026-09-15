import { Injectable, signal } from '@angular/core';
import { StaffAccount } from '../models/user.model';

const ADMIN_SESSION_KEY = 'flare_admin_session';

const mockStaffAccounts: StaffAccount[] = [
  {
    id: '1',
    name: 'أحمد الإداري',
    roleLabel: 'مدير النظام',
    email: 'admin@flare.com',
    avatar: null,
  },
  {
    id: '2',
    name: 'سارة الموظفة',
    roleLabel: 'مسؤول مبيعات',
    email: 'sales@flare.com',
    avatar: null,
  },
];

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  readonly isAdminAuth = signal<boolean>(false);
  readonly isLoadingAuth = signal<boolean>(true);

  // Layout & Sidebar State
  readonly isSidebarOpen = signal<boolean>(false);
  readonly sidebarView = signal<'menu' | 'submenu' | 'accounts'>('menu');
  readonly activeSidebarSubmenuKey = signal<string | null>(null);

  // Account State
  readonly staffAccounts = signal<StaffAccount[]>(mockStaffAccounts);
  readonly activeDashboardAccount = signal<StaffAccount>(mockStaffAccounts[0]);
  readonly isAvatarActionsOpen = signal<boolean>(false);
  readonly isAvatarLoading = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem(ADMIN_SESSION_KEY);
      if (session === 'true') {
        this.isAdminAuth.set(true);
      }
      this.isLoadingAuth.set(false);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
        this.isAdminAuth.set(true);
        resolve(true);
      }, 600);
    });
  }

  logout(): void {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    this.isAdminAuth.set(false);
  }

  selectDashboardAccount(account: StaffAccount): void {
    this.activeDashboardAccount.set(account);
    this.sidebarView.set('menu');
  }

  removeSidebarAvatar(): void {
    const active = this.activeDashboardAccount();
    this.activeDashboardAccount.update((prev) => ({ ...prev, avatar: null }));
    this.staffAccounts.update((prev) =>
      prev.map((acc) => (acc.id === active.id ? { ...acc, avatar: null } : acc))
    );
    this.isAvatarActionsOpen.set(false);
  }

  handleSidebarAvatarChange(file: File): void {
    if (!file) return;

    this.isAvatarLoading.set(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        const newAvatar = e.target?.result as string;
        const active = this.activeDashboardAccount();
        this.activeDashboardAccount.update((prev) => ({ ...prev, avatar: newAvatar }));
        this.staffAccounts.update((prev) =>
          prev.map((acc) => (acc.id === active.id ? { ...acc, avatar: newAvatar } : acc))
        );
        this.isAvatarLoading.set(false);
        this.isAvatarActionsOpen.set(false);
      }, 400);
    };
    reader.readAsDataURL(file);
  }
}
