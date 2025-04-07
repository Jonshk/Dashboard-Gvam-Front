import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { StoreService } from '../../core/services/store/store.service';
import { Role } from '../../core/enums/role';

export interface Menu {
  headTitle1?: string;
  level?: number;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  active?: boolean;
  id?: number;
  bookmark?: boolean;
  children?: Menu[];
  horizontalList?: boolean;
  items?: Menu[];
}

@Injectable({
  providedIn: 'root',
})
export class NavmenuService {
  public isDisplay!: boolean;
  public language: boolean = false;
  public isShow: boolean = false;
  public closeSidebar: boolean = false;

  constructor(private storeService: StoreService) {
    const role = this.storeService.get('role');
    if (role === Role.ADMIN) {
      this.MENUITEMS.push({
        level: 1,
        id: 6,
        path: '/system-users',
        bookmark: true,
        title: 'Usuarios del sistema',
        icon: 'user',
        type: 'link',
      });
    }
  }

  MENUITEMS: Menu[] = [
    {
      headTitle1: 'General',
    },
    {
      level: 1,
      id: 1,
      path: '/groups',
      bookmark: true,
      title: 'Grupos',
      icon: 'home',
      type: 'link',
    },
    {
      level: 1,
      id: 2,
      path: '/applications',
      bookmark: true,
      title: 'Aplicaciones',
      icon: 'file',
      type: 'link',
    },
    {
      level: 1,
      id: 3,
      path: '/users',
      bookmark: true,
      title: 'Usuarios',
      icon: 'user',
      type: 'link',
    },
    {
      level: 1,
      id: 4,
      path: '/policies',
      bookmark: true,
      title: 'Politicas',
      icon: 'chat',
      type: 'link',
    },
    {
      level: 1,
      id: 5,
      path: '/devices',
      bookmark: true,
      title: 'Dispositivos',
      icon: 'others',
      type: 'link',
    },
  ];

  item = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
