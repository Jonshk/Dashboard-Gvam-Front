// src/app/shared/component/sidebar/sidebar.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavmenuService, Menu } from '../../services/navmenu.service';
// IMPORT CORRECTO: desde shared/component/sidebar hasta shared/services
import { LayoutService } from '../../services/layout.service';
import { FeathericonComponent } from '../feathericon/feathericon.component';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FeathericonComponent,
    SvgIconComponent,
    TranslateModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: Menu[] = [];
  public margin = 0;
  public width = window.innerWidth;
  public leftArrowNone = true;
  public rightArrowNone = false;
  public pined = false;
  public pinedItem: number[] = [];

  constructor(
    private router: Router,
    public navServices: NavmenuService,
    public layout: LayoutService     // <-- aquí inyectamos LayoutService
  ) {
    // Inicializa con los ítems actuales
    this.menuItems = this.navServices.MENUITEMS;

    // Actualiza si cambian
    this.navServices.item.subscribe(items => {
      this.menuItems = items;
    });

    // Marca el activo según la URL
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveByUrl(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    // No es obligatorio hacer nada más aquí
  }

  /** Marca como activo el ítem cuya ruta coincide */
  private setActiveByUrl(url: string): void {
    this.menuItems.forEach(item => this.resetActive(item));
    this.findAndActivate(this.menuItems, url);
  }

  /** Resetea la propiedad `active` en un árbol */
  private resetActive(item: Menu): void {
    item.active = false;
    if (item.children) {
      item.children.forEach(child => this.resetActive(child));
    }
  }

  /**
   * Recorre recursivamente y activa el primer item
   * cuya `path` coincide con la URL.
   * Devuelve true si encontró y marcó algo.
   */
  private findAndActivate(items: Menu[], url: string): boolean {
    for (const item of items) {
      if (item.path === url) {
        item.active = true;
        return true;
      }
      if (item.children && this.findAndActivate(item.children, url)) {
        item.active = true;
        return true;
      }
    }
    return false;
  }

  /** Abre o cierra el sidebar */
  openMenu(): void {
    this.navServices.closeSidebar = !this.navServices.closeSidebar;
  }

  /** Desplaza a la izquierda */
  scrollToLeft(): void {
    this.margin = Math.min(this.margin + this.width, 0);
    this.leftArrowNone = this.margin === 0;
    this.rightArrowNone = false;
  }

  /** Desplaza a la derecha */
  scrollToRight(): void {
    this.margin = Math.max(this.margin - this.width, -3500);
    this.leftArrowNone = false;
    this.rightArrowNone = this.margin === -3500;
  }

  /** Abre / cierra submenú */
  toggleMenu(item: Menu): void {
    this.menuItems.forEach(m => {
      if (m !== item) m.active = false;
      m.children?.forEach(c => { if (c !== item) c.active = false; });
    });
    item.active = !item.active;
  }

  /** Comprueba si un ítem está “pineado” */
  isPined(itemid: number): boolean {
    return this.pinedItem.includes(itemid);
  }

  /** Marca / desmarca un ítem como “pinned” */
  togglePined(id: number): void {
    const idx = this.pinedItem.indexOf(id);
    if (idx !== -1) this.pinedItem.splice(idx, 1);
    else this.pinedItem.push(id);
    this.pined = this.pinedItem.length > 0;
  }
}
