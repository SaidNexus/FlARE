import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../core/services/app-state.service';
import { ContactPageConfigService } from '../../core/services/page-configs/contact-page-config.service';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private appState = inject(AppStateService);
  private configService = inject(ContactPageConfigService);
  private langService = inject(LangService);

  readonly isEn = this.langService.isEn;
  readonly pageConfig = this.configService.pageConfig;

  readonly pageTitle = computed(() => (this.isEn() ? this.pageConfig().pageTitleEn : this.pageConfig().pageTitleAr) || this.pageConfig().pageTitle);
  readonly pageSubtitle = computed(() => (this.isEn() ? this.pageConfig().pageSubtitleEn : this.pageConfig().pageSubtitleAr) || this.pageConfig().pageSubtitle);
  readonly formTitle = computed(() => (this.isEn() ? this.pageConfig().formTitleEn : this.pageConfig().formTitleAr) || this.pageConfig().formTitle);
  readonly formSubtitle = computed(() => (this.isEn() ? this.pageConfig().formSubtitleEn : this.pageConfig().formSubtitleAr) || this.pageConfig().formSubtitle);

  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  isSubmitting = false;

  handleSubmit(e: Event): void {
    e.preventDefault();
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      this.appState.showToast(
        this.isEn() ? 'Please fill in all required fields' : 'يرجى تعبئة جميع الحقول المطلوبة',
        'warning'
      );
      return;
    }

    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.appState.showToast(
        this.isEn() ? 'Your message has been sent successfully. We will get back to you soon.' : 'تم إرسال رسالتك بنجاح، سنتواصل معك قريباً',
        'success'
      );
      this.formData = { name: '', email: '', subject: '', message: '' };
    }, 1000);
  }

  handleOpenChat(): void {
    const chatBtn = document.querySelector('[aria-label="تواصل مع خدمة العملاء"], [aria-label="Contact Customer Support"]') as HTMLButtonElement | null;
    if (chatBtn) {
      chatBtn.click();
    } else {
      this.appState.showToast(
        this.isEn() ? 'Customer service is available now via chat' : 'خدمة العملاء متاحة الآن عبر زر المحادثة',
        'info'
      );
    }
  }
}

