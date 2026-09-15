import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  CircleAlert,
  ShieldCheck
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth/auth.service';
import { environment } from '../../../../environments/environment';
import { DEFAULT_STAFF_ACCOUNTS } from '../../../data/mock/staff.mock';
import { StaffRole } from '../../../domain/enums/user-role.enum';

@Component({
  selector: 'app-admin-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-login-page.component.html',
  styleUrl: './admin-login-page.component.css'
})
export class AdminLoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly LogIn = LogIn;
  readonly CircleAlert = CircleAlert;
  readonly ShieldCheck = ShieldCheck;

  email = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(e?: Event): void {
    if (e) {
      e.preventDefault();
    }

    const inputVal = (this.email || '').trim();
    const passVal = (this.password || '').trim();

    if (!inputVal || !passVal) {
      this.error = 'يرجى إدخال اسم المستخدم وكلمة المرور';
      return;
    }

    this.error = '';
    this.loading = true;

    // Check mock accounts or allow any credentials directly
    const matchedMock = DEFAULT_STAFF_ACCOUNTS.find(
      s => s.email.toLowerCase() === inputVal.toLowerCase() || s.name.toLowerCase() === inputVal.toLowerCase()
    );

    const userId = matchedMock ? matchedMock.id : `staff-${Date.now()}`;
    const userName = matchedMock ? matchedMock.name : this.getEmployeeNameFromEmail(inputVal);
    const userEmail = inputVal.includes('@') ? inputVal : `${inputVal}@flare.com`;
    const userRole: StaffRole = matchedMock ? matchedMock.role : 'admin';

    // Direct instant login
    setTimeout(() => {
      this.authService.setUser({
        id: userId,
        name: userName,
        email: userEmail,
        role: userRole,
      });

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`${environment.storagePrefix}auth-token`, 'mock-token-' + userId);
      }

      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
      this.router.navigateByUrl(returnUrl, { replaceUrl: true });
      this.loading = false;
    }, 150);
  }

  submitLogin(e?: Event): void {
    this.onSubmit(e);
  }

  private getEmployeeNameFromEmail(email: string): string {
    const namePart = email.split('@')[0];
    if (!namePart) return 'مدير النظام';
    return namePart
      .split(/[\.\-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'مدير النظام';
  }
}
