import { Routes } from '@angular/router';
import { ContentComponent } from './shared/component/layout/content/content.component';
import { authRoutes } from './pages/auth/auth.routes';
import { dashboardRoutes } from './pages/dashboard/dashboard.routes';

export const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: dashboardRoutes,
  },
  ...authRoutes,
];
