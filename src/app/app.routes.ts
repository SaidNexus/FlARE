import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

// Storefront Pages
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryDetailComponent } from './pages/category-detail/category-detail.component';
import { ProblemsComponent } from './pages/problems/problems.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { OffersComponent } from './pages/offers/offers.component';
import { SearchComponent } from './pages/search/search.component';
import { SizeGuideComponent } from './pages/size-guide/size-guide.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { AboutComponent } from './pages/about/about.component';
import { FaqComponent } from './pages/faq/faq.component';
import { PoliciesComponent } from './pages/policies/policies.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  // Admin Dashboard Area (FLARE Admin)
  {
    path: 'admin',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
  },

  // Storefront Area (Wrapped in MainLayoutComponent)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'FLARE | المتجر الرائد للعناية بالشعر والجمال',
      },
      {
        path: 'products',
        component: ProductsComponent,
        title: 'جميع المنتجات | FLARE',
      },
      {
        path: 'products/:id',
        component: ProductDetailComponent,
        title: 'تفاصيل المنتج | FLARE',
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        title: 'الأقسام والتصنيفات | FLARE',
      },
      {
        path: 'category/:slug',
        component: CategoryDetailComponent,
        title: 'القسم | FLARE',
      },
      {
        path: 'problems',
        component: ProblemsComponent,
        title: 'علاج مشاكل الشعر | FLARE',
      },
      {
        path: 'favorites',
        component: FavoritesComponent,
        title: 'المفضلة | FLARE',
      },
      {
        path: 'offers',
        component: OffersComponent,
        title: 'العروض الحصرية | FLARE',
      },
      {
        path: 'search',
        component: SearchComponent,
        title: 'البحث | FLARE',
      },
      {
        path: 'size-guide',
        component: SizeGuideComponent,
        title: 'دليل العناية والمقاسات | FLARE',
      },
      {
        path: 'cart',
        component: CartComponent,
        title: 'سلة المشتريات | FLARE',
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        title: 'إتمام الطلب | FLARE',
      },
      {
        path: 'order-confirmation',
        component: OrderConfirmationComponent,
        title: 'تأكيد الطلب | FLARE',
      },
      {
        path: 'orders',
        component: MyOrdersComponent,
        title: 'طلباتي | FLARE',
      },
      {
        path: 'my-orders',
        component: MyOrdersComponent,
        title: 'طلباتي | FLARE',
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'تسجيل الدخول | FLARE',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'حسابي الشخصي | FLARE',
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        title: 'الإشعارات | FLARE',
      },
      {
        path: 'about',
        component: AboutComponent,
        title: 'عن فلير | قصة العلامة',
      },
      {
        path: 'faq',
        component: FaqComponent,
        title: 'الأسئلة الشائعة | FLARE',
      },
      {
        path: 'policies',
        component: PoliciesComponent,
        title: 'السياسات والشروط | FLARE',
      },
      {
        path: 'contact',
        component: ContactComponent,
        title: 'اتصل بنا | FLARE',
      },
    ],
  },

  // Fallback Wildcard
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
