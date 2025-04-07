import { Routes } from '@angular/router';
import { isLoggedGuard } from '../../core/guards/auth.guard';
import { hasEnterpriseGuard } from '../../core/guards/has-enterprise.guard';
import { isAdminGuard } from '../../core/guards/is-admin-guard';
import { isIdNumberGuard } from '../../core/guards/is-id-number.guard';
import { ApplicationsPage } from './applications/applications.page';
import { DeviceDetailPage } from './device-detail/device-detail.page';
import { DevicesPage } from './devices/devices.page';
import { EnterprisePage } from './enterprise/enterprise.page';
import { GeofencesPages } from './geofences/geofences.pages';
import { GroupsPage } from './groups/groups.page';
import { PoliciesPage } from './policies/policies.page';
import { SystemUsersPage } from './system-users/system-users.page';
import { UsersPage } from './users/users.page';

export const dashboardRoutes: Routes = [
  {
    path: '',
    redirectTo: 'groups',
    pathMatch: 'full',
  },
  {
    path: 'enterprises',
    data: {
      title: 'Empresas',
    },
    component: EnterprisePage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard, isAdminGuard],
  },
  {
    path: 'groups',
    data: {
      title: 'Grupos',
    },
    component: GroupsPage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard],
  },
  {
    path: 'applications',
    data: {
      title: 'Aplicaciones',
    },
    component: ApplicationsPage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard],
  },
  {
    path: 'users',
    data: {
      title: 'Usuarios',
    },
    component: UsersPage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard],
  },
  {
    path: 'policies',
    data: {
      title: 'Politicas',
    },
    component: PoliciesPage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard],
  },
  {
    path: 'devices',
    data: {
      title: 'Dispositivos',
    },
    component: DevicesPage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard],
  },
  {
    path: 'devices/:deviceId',
    data: {
      title: 'Detalle del dispositivo',
      breadcrumb: 'Detalle del dispositivo',
    },
    component: DeviceDetailPage,
    canMatch: [isIdNumberGuard(1)],
    canActivate: [isLoggedGuard, hasEnterpriseGuard],
  },
  {
    path: 'system-users',
    data: {
      title: 'Usuarios del sistema',
    },
    component: SystemUsersPage,
    canActivate: [isLoggedGuard, hasEnterpriseGuard, isAdminGuard],
  },
  {
    path: 'groups/:groupId/devices',
    data: {
      title: 'Dispositivos',
      breadcrumb: 'Dispositivos',
    },
    component: DevicesPage,
    canMatch: [isIdNumberGuard(1)],
    canActivate: [isLoggedGuard, hasEnterpriseGuard],
  },
  {
    path: 'groups/:groupId/devices/:deviceId',
    data: {
      title: 'Detalle del dispositivo',
      breadcrumb: 'Detalle del dispositivo',
    },
    component: DeviceDetailPage,
    canMatch: [isIdNumberGuard(1), isIdNumberGuard(3)],
    canActivate: [isLoggedGuard, hasEnterpriseGuard],
  },
  {
    path: 'groups/:groupId/policies',
    data: {
      title: 'Políticas',
      breadcrumb: 'Políticas',
    },
    component: PoliciesPage,
    canMatch: [isIdNumberGuard(1)],
    canActivate: [isLoggedGuard, hasEnterpriseGuard],
  },
  {
    path: 'groups/:groupId/geofences',
    data: {
      title: 'Geovallas',
      breadcrumb: 'Geovallas',
    },
    component: GeofencesPages,
    canActivate: [isLoggedGuard, hasEnterpriseGuard],
  },
];
