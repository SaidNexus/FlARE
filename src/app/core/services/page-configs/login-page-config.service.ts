import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect , NgZone, inject} from '@angular/core';





export interface LoginPageConfig {
  heroImage: string;
  heroTitlePrefix: string;
  heroTitlePrefixAr?: string;
  heroTitlePrefixEn?: string;
  heroTitleHighlight: string;
  heroTitleHighlightAr?: string;
  heroTitleHighlightEn?: string;
  heroSubtitle: string;
  heroSubtitleAr?: string;
  heroSubtitleEn?: string;
  welcomeTitle: string;
  welcomeTitleAr?: string;
  welcomeTitleEn?: string;
  welcomeSubtitle: string;
  welcomeSubtitleAr?: string;
  welcomeSubtitleEn?: string;
  showSocialLogin: boolean;
  benefits?: Array<{ id: string; title: string; titleAr?: string; titleEn?: string; line1: string; line1Ar?: string; line1En?: string; line2: string; line2Ar?: string; line2En?: string }>;
}

const initialConfigValue: LoginPageConfig = {
  heroImage: '/assets/login/login-product-scene.png',
  heroTitlePrefix: 'ثقتك تبدأ من ',
  heroTitlePrefixAr: 'ثقتك تبدأ من ',
  heroTitlePrefixEn: 'Confidence begins from ',
  heroTitleHighlight: 'داخلك',
  heroTitleHighlightAr: 'داخلك',
  heroTitleHighlightEn: 'within',
  heroSubtitle: 'منتجات عناية عالية الجودة تمنحك الراحة والجمال في كل لحظة.',
  heroSubtitleAr: 'منتجات عناية عالية الجودة تمنحك الراحة والجمال في كل لحظة.',
  heroSubtitleEn: 'Premium care products giving you comfort and radiance at every moment.',
  welcomeTitle: 'تسجيل الدخول',
  welcomeTitleAr: 'تسجيل الدخول',
  welcomeTitleEn: 'Sign In',
  welcomeSubtitle: 'مرحبًا بك مرة أخرى في FLARE',
  welcomeSubtitleAr: 'مرحبًا بك مرة أخرى في FLARE',
  welcomeSubtitleEn: 'Welcome back to FLARE',
  showSocialLogin: true,
  benefits: [
    { id: 'b1', title: 'آمن وموثوق', titleAr: 'آمن وموثوق', titleEn: 'Safe & Secure', line1: 'حماية بياناتك', line1Ar: 'حماية بياناتك', line1En: 'Data protection', line2: 'بأعلى معايير الأمان', line2Ar: 'بأعلى معايير الأمان', line2En: 'with highest security' },
    { id: 'b2', title: 'استبدال سهل', titleAr: 'استبدال سهل', titleEn: 'Easy Exchange', line1: 'سياسة استبدال', line1Ar: 'سياسة استبدال', line1En: 'Exchange policy', line2: 'مرنة وسهلة', line2Ar: 'مرنة وسهلة', line2En: 'smooth and flexible' },
    { id: 'b3', title: 'توصيل سريع', titleAr: 'توصيل سريع', titleEn: 'Fast Delivery', line1: 'لكافة المناطق', line1Ar: 'لكافة المناطق', line1En: 'To all regions', line2: 'في المملكة', line2Ar: 'في المملكة', line2En: 'in the Kingdom' },
    { id: 'b4', title: 'دعم العملاء', titleAr: 'دعم العملاء', titleEn: 'Customer Support', line1: 'نحن هنا لمساعدتك', line1Ar: 'نحن هنا لمساعدتك', line1En: 'We are here to help', line2: 'في أي وقت', line2Ar: 'في أي وقت', line2En: 'at any time' }
  ]
};


const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

@Injectable({
  providedIn: 'root'
})
export class LoginPageConfigService {
  private readonly storageKey = 'flare-login-config';

  private isApplyingExternalUpdate = false;
  private lastSavedJson: string = '';

  readonly pageConfig = signal<any>(this.loadInitialConfig());

  private zone = inject(NgZone);

  constructor() {
    this.lastSavedJson = JSON.stringify(this.pageConfig());

    window.addEventListener('storage', (e: StorageEvent) => {
      if ((e as any).__sourceInstanceId === INSTANCE_ID) return; // Discard self-triggered synthetic events

      if (e.key === this.storageKey && e.newValue) {
        if (e.newValue === this.lastSavedJson) return; // Discard echo / identical payload

        try {
          const updated = JSON.parse(e.newValue);
          const merged = this.mergeWithInitial(updated);
          const mergedJson = JSON.stringify(merged);
          if (mergedJson === this.lastSavedJson) return;

          this.zone.run(() => {
            this.isApplyingExternalUpdate = true;
            this.lastSavedJson = mergedJson;
            this.pageConfig.set(merged);
            queueMicrotask(() => {
              this.isApplyingExternalUpdate = false;
            });
          });
        } catch (_) {}
      }
    });

    effect(() => {
      const config = this.pageConfig();
      const stringified = JSON.stringify(config);

      if (this.isApplyingExternalUpdate) return;
      if (stringified === this.lastSavedJson) return;

      this.lastSavedJson = stringified;
      localStorage.setItem(this.storageKey, stringified);
      
      try {
        const event = new StorageEvent('storage', {
          key: this.storageKey,
          newValue: stringified,
          storageArea: localStorage,
        });
        (event as any).__sourceInstanceId = INSTANCE_ID;
        window.dispatchEvent(event);
      } catch (_) {}
    });
  }

  updateConfig(newConfig: any) {
    this.zone.run(() => { this.pageConfig.set(newConfig); });
  }

  private loadInitialConfig(): any {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return initialConfigValue;
  }

  private mergeWithInitial(parsed: any): any {
    return sanitizeWithInitial(parsed, initialConfigValue);
  }
}
