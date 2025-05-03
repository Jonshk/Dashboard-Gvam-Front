import { Component, HostListener } from '@angular/core';
import { NavmenuService } from '../../../services/navmenu.service';
import { HideNavScrollService } from '../../../services/hide-nav-scroll.service';
import { LayoutService } from '../../../../shared/services/layout.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { FeathericonComponent } from '../../feathericon/feathericon.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent,
    FeathericonComponent,
    RouterOutlet,
  ],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent {
  public innerWidth!: number;

  constructor(
    public layout: LayoutService,
    public navmenu: NavmenuService,
    public hidenav: HideNavScrollService,
  ) {
    if (window.innerWidth < 1185) {
      navmenu.closeSidebar = true;
    }

    if (window.innerWidth <= 992) {
      this.layout.config.settings.sidebar_type = 'compact-wrapper';
    } else {
      this.layout.config.settings.sidebar_type =
        this.layout.config.settings.sidebar_type;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth < 1185) {
      this.navmenu.closeSidebar = true;
    } else {
      this.navmenu.closeSidebar = false;
    }

    if (window.innerWidth <= 992) {
      this.layout.config.settings.sidebar_type = 'compact-wrapper';
    } else {
      this.layout.config.settings.sidebar_type =
        this.layout.config.settings.sidebar_type;
    }
  }
}
