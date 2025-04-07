import { Routes } from '@angular/router';
import { RegisterPage } from './register/register.page';
import { isNotLoggedGuard } from '../../core/guards/auth.guard';
import { LoginPage } from './login/login.page';

export const authRoutes: Routes = [
  // {
  //   path: 'register',
  //   component: RegisterPage,
  //   canActivate: [isNotLoggedGuard],
  // },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [isNotLoggedGuard],
  },
];
