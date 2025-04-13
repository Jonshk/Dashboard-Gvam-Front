import { Component } from '@angular/core';
import { Menu, NavmenuService } from '../../services/navmenu.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { CommonModule } from '@angular/common';
import { FeathericonComponent } from '../feathericon/feathericon.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NgbModule, FeathericonComponent, SvgIconComponent, RouterModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  public menuItems = this.navServices.MENUITEMS;
  public menu: Menu[] = [];
  public margin: number = 0;
  public width: number = window.innerWidth;
  public leftArrowNone: boolean = true;
  public rightArrowNone: boolean = false;
  public screenWidth!: number;
  public screenHeight!: number;
  public pined: boolean = false;
  public pinedItem: number[] = [];

  constructor(private router: Router, public navServices: NavmenuService, public layout: LayoutService) {
    if(window.innerWidth < 1185){
      this.navServices.closeSidebar = true;
    }
    this.menu = this.navServices.MENUITEMS;

    this.navServices.item.subscribe((menuItems: Menu[]) => {
      this.menuItems = menuItems;
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          menuItems.filter(items => {
            if (items.path === event.url) {
              this.setNavActive(items);
            }
            if (!items.children) {
              return false;
            }
            items.children.filter((subItems: Menu) => {
              if (subItems.path === event.url) {
                this.setNavActive(subItems);
              }
              if (!subItems.children) {
                return false;
              }
              subItems.children.filter((subSubItems) => {
                if (subSubItems.path === event.url) {
                  this.setNavActive(subSubItems);
                }
              });
              return
            });
            return
          });
        }
      });
    });
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  setNavActive(item: Menu) {
    this.menuItems.filter(menuItem => {
      if (menuItem !== item) {
        menuItem.active = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
          else {
            submenuItems.active = false;
          }
        });
      }
    });
  }

  openMenu() {
    this.navServices.closeSidebar = !this.navServices.closeSidebar;
  }

  // For Horizontal Menu





  scrollToLeft() {
    if (this.margin >= -this.width) {
      this.margin = 0;
      this.leftArrowNone = true;
      this.rightArrowNone = false;
    } else {
      this.margin += this.width;
      this.rightArrowNone = false;
    }
  }

  scrollToRight() {
    if (this.margin <= -3500) {
      this.margin = -3000;
      this.leftArrowNone = false;
      this.rightArrowNone = true;
    } else {
      this.margin += -this.width;
      this.leftArrowNone = false;
    }
  }
  

  // scrollToLeft() {
  //   this.rightArrow = true;
  //   if (this.layout.margin != 0) {
  //     this.layout.margin = this.layout.margin + 500;
  //   }

  //   if (this.layout.margin == 0) {
  //     this.leftArrow = false;
  //   }
  // }

  // scrollToRight() {
  //   this.leftArrow = true;
  //   if (this.layout.margin != -3500) {
  //     this.layout.margin = this.layout.margin - 500;
  //   }
  //   if (this.layout.margin == -3500) {
  //     this.rightArrow = false;
  //   }
  // }

  toggleMenu(item: Menu) {
    if (!item.active) {
      this.menuItems.forEach((a: Menu) => {
        if (this.menuItems.includes(item)) {
          a.active = false;
        }
        if (!a.children) {
          return false;
        }
        a.children.forEach((b: Menu) => {
          if (a.children?.includes(item)) {
            b.active = false;
          }
        });
        return;
      });
    }
    item.active = !item.active;
  }


  isPined(itemid: number) {
    return this.pinedItem.includes(itemid);
  }

  togglePined(id: number): void {
    const index = this.pinedItem.indexOf(id);
    if (index !== -1) {
      this.pinedItem.splice(index, 1);
    } else {
      this.pinedItem.push(id);
    }
    if (this.pinedItem.length <= 0) {
      this.pined = false;
    } else {
      this.pined = true;
    }
  }

}
