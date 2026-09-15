import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('Flare.Angular');
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private routerSub?: Subscription;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Notify parent dashboard if running inside an iframe
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e) => {
        const nav = e as NavigationEnd;
        const pathname = nav.urlAfterRedirects.split('?')[0];

        if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
          window.parent.postMessage(
            { type: 'STOREFRONT_ROUTE_CHANGE', pathname },
            '*'
          );
        }
      });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }
}
