import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  public language = false;
  public isShow = false;
  public closeSidebar = false;

  // Tu definición del menú
  MENUITEMS: Menu[] = [
    { headTitle1: 'Inventario' },
    {
      level: 1,
      id: 1,
      path: '/stock',
      bookmark: true,
      title: 'PRODUCTOS',
      icon: 'package',     // Feather Icons: 'package'
      type: 'link',
    },
    {
      level: 1,
      id: 2,
      path: '/centers',
      bookmark: true,
      title: 'CENTROS',
      icon: 'map-pin',     // Feather Icons: 'map-pin'
      type: 'link',
    },
    {
      level: 1,
      id: 3,
      path: '/orders',
      bookmark: true,
      title: 'PEDIDOS',
      icon: 'shopping-cart', // Feather Icons: 'shopping-cart'
      type: 'link',
    },
    {
      level: 1,
      id: 4,
      path: '/repairs',
      bookmark: true,
      title: 'REPARACIONES',
      icon: 'tool',        // Feather Icons: 'tool'
      type: 'link',
    },
    {
      level: 1,
      id: 5,
      path: '/receptions',
      bookmark: true,
      title: 'RECEPCIONES',
      icon: 'inbox',       // Feather Icons: 'inbox'
      type: 'link',
    },
    {
      level: 1,
      id: 6,
      path: '/reports',
      bookmark: true,
      title: 'REPORTES',
      icon: 'bar-chart-2', // Feather Icons: 'bar-chart-2'
      type: 'link',
    },
  ];

  // Para que el componente se suscriba
  public item = new BehaviorSubject<Menu[]>(this.MENUITEMS);

  constructor(private storeService: StoreService) {
    // Si quieres añadir ítems basados en rol, hazlo aquí
  }
}
