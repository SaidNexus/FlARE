import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-chat-page',
  standalone: true,
  imports: [],
  template: ''
})
export class AdminChatPageComponent implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    // صفحة الشات المنفصلة أُلغيت.
    // الشات أصبح نافذة عائمة مشتركة داخل كل صفحات لوحة التحكم.
    this.router.navigate(['/admin'], { replaceUrl: true });
  }
}
