import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

export type Lang = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  private readonly LANG_KEY = 'flare-lang';
  private translate = inject(TranslateService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  /**
   * User-selected Storefront language preference ('ar' or 'en').
   * Persisted in localStorage ('flare-lang').
   */
  readonly storefrontLang = signal<Lang>(this.getInitialLang());

  /**
   * Whether the active route is in the Dashboard/Admin area (/admin).
   */
  readonly isAdmin = signal<boolean>(this.checkIfAdmin());

  /**
   * Effective active language for ngx-translate:
   * - In Dashboard (/admin): ALWAYS 'ar'
   * - In Storefront: storefrontLang()
   */
  readonly effectiveLang = computed<Lang>(() => (this.isAdmin() ? 'ar' : this.storefrontLang()));

  /**
   * Whether the storefront is in English mode
   */
  readonly isEn = computed<boolean>(() => this.storefrontLang() === 'en');

  /**
   * Backwards-compatible alias for lang
   */
  readonly lang = computed<Lang>(() => this.effectiveLang());

  /**
   * Effective direction:
   * - In Dashboard (/admin): ALWAYS 'rtl'
   * - In Storefront: 'rtl' if ar, 'ltr' if en
   */
  readonly dir = computed<'rtl' | 'ltr'>(() => (this.effectiveLang() === 'ar' ? 'rtl' : 'ltr'));
  readonly isRtl = computed<boolean>(() => this.dir() === 'rtl');

  constructor() {
    this.syncLang();

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects || e.url;
        const inAdmin = url.startsWith('/admin');
        if (this.isAdmin() !== inAdmin) {
          this.isAdmin.set(inAdmin);
          this.syncLang();
        }
      });
  }

  private checkIfAdmin(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  }

  private getInitialLang(): Lang {
    if (!isPlatformBrowser(this.platformId)) return 'ar';
    
    const stored = window.localStorage.getItem(this.LANG_KEY);
    if (stored === 'ar' || stored === 'en') {
      return stored;
    }

    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase().substring(0, 2);
      if (browserLang === 'ar' || browserLang === 'en') {
        return browserLang as Lang;
      }
    }

    return 'ar';
  }

  setLang(nextLang: Lang) {
    this.storefrontLang.set(nextLang);
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(this.LANG_KEY, nextLang);
    }
    this.syncLang();
  }

  toggleLang() {
    this.setLang(this.storefrontLang() === 'ar' ? 'en' : 'ar');
  }

  private syncLang() {
    const currentLang = this.effectiveLang();
    this.translate.use(currentLang);
    if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.dir = this.dir();
      document.documentElement.lang = currentLang;
      if (this.dir() === 'rtl') {
        document.documentElement.classList.add('is-rtl');
        document.documentElement.classList.remove('is-ltr');
      } else {
        document.documentElement.classList.add('is-ltr');
        document.documentElement.classList.remove('is-rtl');
      }
    }
  }
}
