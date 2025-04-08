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

  // Definición actualizada del menú según las especificaciones:
  MENUITEMS: Menu[] = [
    {
      headTitle1: 'General',
    },
    {
      level: 1,
      id: 1,
      path: '/products', // Cambiado de '/groups' a '/products'
      bookmark: true,
      title: 'PRODUCTOS', // Nuevo título
      icon: 'inventory',  // Asegúrate de tener este ícono definido
      type: 'link',
    },
    {
      level: 1,
      id: 2,
      path: '/centers', // Ruta para centros
      bookmark: true,
      title: 'CENTROS', // Nuevo título
      icon: 'centers',  // Ícono actualizado (asegúrate de que exista)
      type: 'link',
    },
    {
      level: 1,
      id: 3,
      path: '/orders', // Ruta para pedidos
      bookmark: true,
      title: 'PEDIDOS', // Nuevo título (en lugar de ENVIOS)
      icon: 'shipping', // Ícono actualizado
      type: 'link',
    },
    {
      level: 1,
      id: 4,
      path: '/repairs', // Ruta para reparaciones
      bookmark: true,
      title: 'REPARACIONES', // Nuevo título
      icon: 'repairs', // Ícono actualizado
      type: 'link',
    },
    {
      level: 1,
      id: 5,
      path: '/receptions', // Ruta para recepciones
      bookmark: true,
      title: 'RECEPCIONES', // Nuevo título
      icon: 'receptions', // Ícono actualizado
      type: 'link',
    },
    {
      level: 1,
      id: 6,
      path: '/reports', // Ruta para reportes
      bookmark: true,
      title: 'REPORTES', // Nuevo título
      icon: 'reports',  // Ícono actualizado
      type: 'link',
    },
  ];

  item = new BehaviorSubject<Menu[]>(this.MENUITEMS);

  constructor(private storeService: StoreService) {
    // Se eliminó la condición que agregaba "Usuarios del sistema" para rol ADMIN,
    // ya que en tus especificaciones el menú queda definido con los 6 items mencionados.
  }
}
