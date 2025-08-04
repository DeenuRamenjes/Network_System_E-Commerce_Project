import { ProductListComponent } from './pages/product-list/product-list';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { CartComponent } from './pages/cart/cart';
import { CheckoutComponent } from './pages/checkout/checkout';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    pathMatch: 'full'
  },
  { 
    path: 'product/:id', 
    component: ProductDetailComponent 
  },
  { 
    path: 'cart', 
    component: CartComponent 
  },
  { 
    path: 'checkout', 
    component: CheckoutComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'admin', 
    component: AdminDashboardComponent 
  },
  { 
    path: '**', 
    redirectTo: '/' 
  }
];
