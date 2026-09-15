import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { User, isStaffRole } from '../../../domain/models/user.model';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

const TOKEN_KEY = `${environment.storagePrefix}auth-token`;
const SESSION_KEY = `${environment.storagePrefix}session`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  readonly user = signal<User | null>(this.getInitialUser());
  readonly isAdmin = computed(() => isStaffRole(this.user()?.role));

  private getInitialUser(): User | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && parsed.id && parsed.role) return parsed;
      }
      // Check if legacy flare admin session was active
      if (localStorage.getItem('flare_admin_session') === 'true') {
        return {
          id: 'staff-admin',
          name: 'أحمد الإداري',
          email: 'admin@flare.com',
          role: 'admin'
        };
      }
    } catch {}
    return null;
  }

  isAuthenticated(): boolean {
    if (this.user() !== null) return true;
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return false;
      }
      return Boolean(payload.sub || payload.nameid);
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  async fetchUser(): Promise<User | null> {
    if (environment.useMockData) {
      return this.user();
    }

    const token = this.getToken();
    if (!token) {
      this.setUser(null);
      return null;
    }

    let tokenPayload: any = null;
    try {
      tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.exp && tokenPayload.exp < Date.now() / 1000) {
        this.setUser(null);
        return null;
      }
    } catch {
      this.setUser(null);
      return null;
    }

    try {
      const url = `${environment.apiBaseUrl || '/api'}/users/me`;
      const res = await firstValueFrom(this.http.get<any>(url, { withCredentials: true }));

      const isOk = res?.success !== undefined
        ? res.success
        : (res?.isSuccess !== undefined ? res.isSuccess : true);

      const data = res?.data ?? res;

      if (isOk && data && data.id) {
        const userObj: User = {
          id: data.id,
          name: data.name || tokenPayload?.unique_name || 'موظف',
          email: data.email || (Array.isArray(tokenPayload?.email) ? tokenPayload.email[0] : tokenPayload?.email) || '',
          role: (data.role || tokenPayload?.role || tokenPayload?.Role || 'admin').toLowerCase() as UserRole
        };
        this.setUser(userObj);
        return userObj;
      }
    } catch { }

    if (tokenPayload && (tokenPayload.sub || tokenPayload.nameid)) {
      const userObj: User = {
        id: tokenPayload.sub || tokenPayload.nameid,
        name: tokenPayload.unique_name || 'موظف',
        email: (Array.isArray(tokenPayload?.email) ? tokenPayload.email[0] : tokenPayload?.email) || '',
        role: (tokenPayload.role || 'admin').toLowerCase() as UserRole
      };
      this.setUser(userObj);
      return userObj;
    }

    this.setUser(null);
    return null;
  }

  setUser(nextUser: User | null) {
    this.user.set(nextUser);
    if (isPlatformBrowser(this.platformId)) {
      if (nextUser) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
        localStorage.setItem('flare_admin_session', 'true');
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem('flare_admin_session');
      }
    }
  }
}
