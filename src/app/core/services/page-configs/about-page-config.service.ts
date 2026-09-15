import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect, inject, NgZone } from '@angular/core';


const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

export interface AboutReasonConfig {
    id: string;
    icon: string;
    title: string;
    titleAr?: string;
    titleEn?: string;
    text: string;
    textAr?: string;
    textEn?: string;
}

export interface AboutValueConfig {
    id: string;
    icon: string;
    label: string;
    labelAr?: string;
    labelEn?: string;
}

export interface AboutContactConfig {
    id: string;
    icon: string;
    label: string;
    labelAr?: string;
    labelEn?: string;
    link: string;
}

export interface AboutPageConfig {
    showTitle: boolean;
    headerTitle: string;
    headerTitleAr?: string;
    headerTitleEn?: string;
    headerSubtitle: string;
    headerSubtitleAr?: string;
    headerSubtitleEn?: string;
    
    showIntroSection: boolean;
    introText: string;
    introTextAr?: string;
    introTextEn?: string;
    
    showReasonsSection: boolean;
    reasonsTitle: string;
    reasonsTitleAr?: string;
    reasonsTitleEn?: string;
    reasons: AboutReasonConfig[];
    
    showVisionSection: boolean;
    visionTitle: string;
    visionTitleAr?: string;
    visionTitleEn?: string;
    visionText: string;
    visionTextAr?: string;
    visionTextEn?: string;
    
    showMissionSection: boolean;
    missionTitle: string;
    missionTitleAr?: string;
    missionTitleEn?: string;
    missionText: string;
    missionTextAr?: string;
    missionTextEn?: string;
    
    showValuesSection: boolean;
    valuesTitle: string;
    valuesTitleAr?: string;
    valuesTitleEn?: string;
    values: AboutValueConfig[];
    
    showContactSection: boolean;
    contactTitle: string;
    contactTitleAr?: string;
    contactTitleEn?: string;
    contacts: AboutContactConfig[];
}

const initialConfig: AboutPageConfig = {
    showTitle: true,
    headerTitle: 'من نحن',
    headerTitleAr: 'من نحن',
    headerTitleEn: 'About Us',
    headerSubtitle: 'FLARE... جمالك، ثقتك، تألقك',
    headerSubtitleAr: 'FLARE... جمالك، ثقتك، تألقك',
    headerSubtitleEn: 'FLARE... Your Beauty, Confidence, and Radiance',
    
    showIntroSection: true,
    introText: 'FLARE هي علامتك الموثوقة لمنتجات العناية بالشعر الفاخرة والعالية الجودة.\n\nنحن نؤمن أن الثقة تبدأ من العناية الصحيحة، ونبتكر لكِ الأفضل لتشعري بأجمل إطلالة كل يوم.',
    introTextAr: 'FLARE هي علامتك الموثوقة لمنتجات العناية بالشعر الفاخرة والعالية الجودة.\n\nنحن نؤمن أن الثقة تبدأ من العناية الصحيحة، ونبتكر لكِ الأفضل لتشعري بأجمل إطلالة كل يوم.',
    introTextEn: 'FLARE is your trusted brand for luxury, premium hair care products.\n\nWe believe true confidence starts with proper care, crafting the best formulas for your radiant look every day.',
    
    showReasonsSection: true,
    reasonsTitle: 'لماذا FLARE؟',
    reasonsTitleAr: 'لماذا FLARE؟',
    reasonsTitleEn: 'Why FLARE?',
    reasons: [
        { id: '1', icon: 'ShieldCheck', title: 'جودة استثنائية', titleAr: 'جودة استثنائية', titleEn: 'Exceptional Quality', text: 'نختار مكوناتنا بعناية فائقة لضمان أفضل النتائج لشعرك.', textAr: 'نختار مكوناتنا بعناية فائقة لضمان أفضل النتائج لشعرك.', textEn: 'We carefully select ingredients to ensure superior results.' },
        { id: '2', icon: 'Heart', title: 'تركيبات طبيعية', titleAr: 'تركيبات طبيعية', titleEn: 'Natural Formulas', text: 'منتجات خالية من الكبريتات والمواد القاسية وآمنة للاستخدام اليومي.', textAr: 'منتجات خالية من الكبريتات والمواد القاسية وآمنة للاستخدام اليومي.', textEn: 'Sulfate-free, gentle formulas safe for daily use.' },
        { id: '3', icon: 'Star', title: 'نتائج ملحوظة', titleAr: 'نتائج ملحوظة', titleEn: 'Visible Results', text: 'تألق وقوة وكثافة تلاحظينها من الاستخدامات الأولى.', textAr: 'تألق وقوة وكثافة تلاحظينها من الاستخدامات الأولى.', textEn: 'Strength, shine, and fullness you notice from the very first uses.' }
    ],
    
    showVisionSection: true,
    visionTitle: 'رؤيتنا',
    visionTitleAr: 'رؤيتنا',
    visionTitleEn: 'Our Vision',
    visionText: 'أن نكون الخيار الأول في مجال منتجات العناية الفاخرة بالشعر والجمال في المملكة والخليج من خلال الجودة، الابتكار وخدمة العملاء المتميزة.',
    visionTextAr: 'أن نكون الخيار الأول في مجال منتجات العناية الفاخرة بالشعر والجمال في المملكة والخليج من خلال الجودة، الابتكار وخدمة العملاء المتميزة.',
    visionTextEn: 'To be the premier choice for luxury hair care and beauty across the region through uncompromised quality and customer service.',
    
    showMissionSection: true,
    missionTitle: 'رسالتنا',
    missionTitleAr: 'رسالتنا',
    missionTitleEn: 'Our Mission',
    missionText: 'تقديم منتجات مبتكرة وموثوقة بتركيبات طبيعية متطورة تساعدك على إبراز جمالك الطبيعي وتألقك الدائم، مع تجربة تسوق سهلة وسريعة.',
    missionTextAr: 'تقديم منتجات مبتكرة وموثوقة بتركيبات طبيعية متطورة تساعدك على إبراز جمالك الطبيعي وتألقك الدائم، مع تجربة تسوق سهلة وسريعة.',
    missionTextEn: 'Providing safe and trusted products that elevate your beauty and confidence, with a seamless, swift shopping experience.',
    
    showValuesSection: true,
    valuesTitle: 'قيمنا',
    valuesTitleAr: 'قيمنا',
    valuesTitleEn: 'Our Values',
    values: [
        { id: '1', icon: 'ShieldCheck', label: 'المصداقية', labelAr: 'المصداقية', labelEn: 'Integrity' },
        { id: '2', icon: 'Heart', label: 'العناية بالعميل', labelAr: 'العناية بالعميل', labelEn: 'Customer Care' },
        { id: '3', icon: 'Star', label: 'الجودة العالية', labelAr: 'الجودة العالية', labelEn: 'High Quality' },
        { id: '4', icon: 'Target', label: 'الابتكار المستمر', labelAr: 'الابتكار المستمر', labelEn: 'Continuous Innovation' },
        { id: '5', icon: 'Check', label: 'الشفافية', labelAr: 'الشفافية', labelEn: 'Transparency' }
    ],
    
    showContactSection: true,
    contactTitle: 'تواصل معنا',
    contactTitleAr: 'تواصل معنا',
    contactTitleEn: 'Contact Us',
    contacts: [
        { id: '1', icon: 'facebook', label: 'فيسبوك', labelAr: 'فيسبوك', labelEn: 'Facebook', link: 'https://facebook.com' },
        { id: '2', icon: 'instagram', label: 'إنستغرام', labelAr: 'إنستغرام', labelEn: 'Instagram', link: 'https://instagram.com' },
        { id: '3', icon: 'mail', label: 'بريد إلكتروني', labelAr: 'بريد إلكتروني', labelEn: 'Email', link: 'mailto:support@FLARE.com' },
        { id: '4', icon: 'phone', label: 'اتصال', labelAr: 'اتصال', labelEn: 'Phone Call', link: 'tel:+201000000000' },
        { id: '5', icon: 'whatsapp', label: 'واتساب', labelAr: 'واتساب', labelEn: 'WhatsApp', link: 'https://wa.me/201000000000' }
    ]
};

@Injectable({
  providedIn: 'root'
})
export class AboutPageConfigService {
  private readonly storageKey = 'FLARE-about-page-config';

  private isApplyingExternalUpdate = false;
  private lastSavedJson: string = '';

  readonly pageConfig = signal<AboutPageConfig>(this.loadInitialConfig());
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

  updateConfig(newConfig: AboutPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): AboutPageConfig {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return initialConfig;
  }

  private mergeWithInitial(parsed: any): any {
    return sanitizeWithInitial(parsed, initialConfig);
  }
}
