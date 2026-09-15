import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStateService } from '../../core/services/app-state.service';
import { AuthService } from '../../core/services/auth.service';
import { ProfilePageConfigService } from '../../core/services/page-configs/profile-page-config.service';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private appState = inject(AppStateService);
  private router = inject(Router);
  private configService = inject(ProfilePageConfigService);
  private langService = inject(LangService);

  readonly isEn = computed(() => this.langService.storefrontLang() === 'en');

  readonly pageConfig = this.configService.pageConfig;

  readonly headerTitle = computed(() => (this.isEn() ? this.pageConfig().headerTitleEn : this.pageConfig().headerTitleAr) || this.pageConfig().headerTitle);
  readonly headerSubtitle = computed(() => (this.isEn() ? this.pageConfig().headerSubtitleEn : this.pageConfig().headerSubtitleAr) || this.pageConfig().headerSubtitle);

  get user() {
    return this.appState.user();
  }

  loading = true;
  saving = false;

  form = {
    name: '',
    phone: '',
    city: '',
    country: 'المملكة العربية السعودية',
  };

  ngOnInit(): void {
    const currentUser = this.user;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService
      .getProfile(currentUser.id)
      .then((data) => {
        this.form = {
          name: (this.isEn() ? data.nameEn : data.nameAr) || data.nameAr || data.name || '',
          phone: data.phone || '',
          city: (data as any).city || '',
          country: (data as any).country || (this.isEn() ? 'Saudi Arabia' : 'المملكة العربية السعودية'),
        };
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  }

  updateField(key: 'name' | 'phone' | 'city' | 'country', value: string): void {
    this.form[key] = value;
  }

  async handleSave(e: Event): Promise<void> {
    e.preventDefault();
    const currentUser = this.user;
    if (!currentUser) return;

    this.saving = true;
    try {
      await this.authService.updateProfile(currentUser.id, {
        nameAr: this.form.name,
        name: this.form.name,
        phone: this.form.phone,
        city: this.form.city,
        country: this.form.country,
      } as any);
      this.appState.showToast(this.isEn() ? 'Changes saved successfully!' : 'تم حفظ التغييرات بنجاح!');
    } catch {
      this.appState.showToast(this.isEn() ? 'An error occurred while saving.' : 'حدث خطأ أثناء الحفظ.', 'error');
    } finally {
      this.saving = false;
    }
  }

  handleLogout(): void {
    this.appState.setUser(null);
    this.router.navigate(['/login']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
