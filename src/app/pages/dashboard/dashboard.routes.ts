import { Routes } from '@angular/router';
import { isLoggedGuard } from '../../core/guards/auth.guard';
import { hasEnterpriseGuard } from '../../core/guards/has-enterprise.guard';

import { StockPageComponent } from './stock/stock-page.component';
import { CentersPage } from './centers/centers.page';
import { OrdersPage } from './orders/orders.page';
import { RepairsPage } from './repairs/repairs.page';
import { ReceptionsPage } from './receptions/receptions.page';
import { ReportsPage } from './reports/reports.page';

export const dashboardRoutes: Routes = [
  {
    path: '',
    redirectTo: 'stock',
    pathMatch: 'full'
  },
  {
    path: 'stock',
    data: { title: 'STOCK' },
    component:  StockPageComponent,
    canActivate: [isLoggedGuard, hasEnterpriseGuard]
  },
  {
    path: 'centers',
    data: { title: 'CENTROS' },
    component: CentersPage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard]
  },
  {
    path: 'orders',
    data: { title: 'PEDIDOS' },
    component: OrdersPage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard]
  },
  {
    path: 'repairs',
    data: { title: 'REPARACIONES' },
    component: RepairsPage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard]
  },
  {
    path: 'receptions',
    data: { title: 'RECEPCIONES' },
    component: ReceptionsPage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard]
  },
  {
    path: 'reports',
    data: { title: 'REPORTES' },
    component: ReportsPage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard]
  },
];
