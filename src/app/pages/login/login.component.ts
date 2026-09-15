import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppStateService } from '../../core/services/app-state.service';
import { LoginPageConfigService } from '../../core/services/page-configs/login-page-config.service';
import { LangService } from '../../core/services/lang.service';

interface Benefit {
  title: string;
  lines: [string, string];
  icon: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private appState = inject(AppStateService);
  private router = inject(Router);
  private configService = inject(LoginPageConfigService);
  private langService = inject(LangService);

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');

  readonly pageConfig = this.configService.pageConfig;

  readonly heroTitlePrefix = computed(() => (this.isEn() ? this.pageConfig().heroTitlePrefixEn : this.pageConfig().heroTitlePrefixAr) || this.pageConfig().heroTitlePrefix);
  readonly heroTitleHighlight = computed(() => (this.isEn() ? this.pageConfig().heroTitleHighlightEn : this.pageConfig().heroTitleHighlightAr) || this.pageConfig().heroTitleHighlight);
  readonly heroSubtitle = computed(() => (this.isEn() ? this.pageConfig().heroSubtitleEn : this.pageConfig().heroSubtitleAr) || this.pageConfig().heroSubtitle);
  readonly welcomeTitle = computed(() => (this.isEn() ? this.pageConfig().welcomeTitleEn : this.pageConfig().welcomeTitleAr) || this.pageConfig().welcomeTitle);
  readonly welcomeSubtitle = computed(() => (this.isEn() ? this.pageConfig().welcomeSubtitleEn : this.pageConfig().welcomeSubtitleAr) || this.pageConfig().welcomeSubtitle);

  showPassword = false;
  isSubmitting = false;

  form = {
    email: '',
    password: '',
    remember: false,
  };

  benefits: Benefit[] = [
    {
      title: 'آمن وموثوق',
      lines: ['حماية بياناتك', 'بأعلى معايير الأمان'],
      icon: 'shield',
    },
    {
      title: 'استبدال سهل',
      lines: ['سياسة استبدال', 'مرنة وسهلة'],
      icon: 'box',
    },
    {
      title: 'توصيل سريع',
      lines: ['لكافة المناطق', 'في المملكة'],
      icon: 'truck',
    },
    {
      title: 'دعم العملاء',
      lines: ['نحن هنا لمساعدتك', 'في أي وقت'],
      icon: 'headphones',
    },
  ];

  readonly localizedBenefits = computed(() => {
    const cfg = this.pageConfig().benefits;
    if (cfg && cfg.length) {
      return cfg.map((b: any) => ({
        title: (this.isEn() ? b.titleEn : b.titleAr) || b.title,
        lines: [
          (this.isEn() ? b.line1En : b.line1Ar) || b.line1,
          (this.isEn() ? b.line2En : b.line2Ar) || b.line2
        ] as [string, string],
        icon: b.id === 'b1' ? 'shield' : b.id === 'b2' ? 'box' : b.id === 'b3' ? 'truck' : 'headphones'
      }));
    }
    return this.benefits.map((b) => ({
      title: this.isEn() ? (b.icon === 'shield' ? 'Safe & Secure' : b.icon === 'box' ? 'Easy Exchange' : b.icon === 'truck' ? 'Fast Delivery' : 'Customer Support') : b.title,
      lines: this.isEn() ? (b.icon === 'shield' ? ['Data protection', 'with highest standards'] : b.icon === 'box' ? ['Exchange policy', 'smooth and flexible'] : b.icon === 'truck' ? ['To all regions', 'in the Kingdom'] : ['We are here to help', 'at any time']) : b.lines,
      icon: b.icon
    }));
  });

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const rememberedEmail = localStorage.getItem('flare-remembered-email');
      if (rememberedEmail) {
        this.form.email = rememberedEmail;
        this.form.remember = true;
      }
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  async handleSubmit(): Promise<void> {
    if (!this.form.email.trim() || !this.form.password.trim()) return;

    if (typeof window !== 'undefined') {
      if (this.form.remember) {
        localStorage.setItem('flare-remembered-email', this.form.email.trim());
      } else {
        localStorage.removeItem('flare-remembered-email');
      }
    }

    this.isSubmitting = true;
    try {
      const user = await this.authService.login(this.form.email.trim(), this.form.password);
      this.appState.setUser(user);
      this.appState.showToast(this.isEn() ? 'Signed in successfully!' : 'تم تسجيل الدخول بنجاح!');
      if (user.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (err: any) {
      this.appState.showToast(err.message || (this.isEn() ? 'Login failed' : 'فشل تسجيل الدخول'), 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  handleSocialLogin(): void {
    this.router.navigate(['/']);
  }
}
