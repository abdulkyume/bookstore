import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { authGuard } from './core/gurad/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'signin', component: SigninComponent },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(mod => mod.DashboardComponent),

    canActivate: [authGuard],
  },
];
