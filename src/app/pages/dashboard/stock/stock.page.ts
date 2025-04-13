import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CategoryDetailModalComponent } from './category-detail-modal.component';
import { ProductModalComponent } from './product-modal.component';

export interface StockItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  category: string; // Ejemplo: "Baterías", "Pantallas LCD", etc.
}

export interface StockGroup {
  category: string;
  items: StockItem[];
}

@Component({
  selector: 'app-stock-page',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatButtonModule, MatIconModule],
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss']
})
export class StockPageComponent implements OnInit {
  // Datos simulados de inventario
  stockItems: StockItem[] = [
    { id: 1, productName: 'Batería modelo A', quantity: 50, price: 9.99, category: 'Baterías' },
    { id: 2, productName: 'Batería modelo B', quantity: 20, price: 19.99, category: 'Baterías' },
    { id: 3, productName: 'Pantalla LCD Samsung', quantity: 30, price: 99.99, category: 'Pantallas LCD' },
    { id: 4, productName: 'Pantalla LCD Xiaomi', quantity: 25, price: 89.99, category: 'Pantallas LCD' }
  ];

  stockGroups: StockGroup[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.groupStockItems();
  }

  // Agrupa los items por categoría para mostrarlos en el acordeón
  groupStockItems(): void {
    const groups: { [key: string]: StockItem[] } = {};
    this.stockItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    this.stockGroups = Object.keys(groups).map(category => ({
      category,
      items: groups[category]
    }));
  }

  // Abre un modal para ver más detalles de la categoría (por ejemplo, subdivisiones)
  openCategoryDetail(category: string): void {
    this.dialog.open(CategoryDetailModalComponent, {
      width: '600px',
      data: { category, items: this.stockItems.filter(item => item.category === category) }
    });
  }

  // Abre el modal para agregar (si no se pasa item) o editar un producto
  openProductModal(item?: StockItem): void {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '400px',
      data: { product: item ? { ...item } : null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item) {
          // Actualizar producto existente
          const index = this.stockItems.findIndex(i => i.id === item.id);
          if (index > -1) {
            this.stockItems[index] = result;
          }
        } else {
          // Agregar nuevo producto (asigna un nuevo ID)
          result.id = this.getNextId();
          this.stockItems.push(result);
        }
        this.groupStockItems();
      }
    });
  }

  deleteProduct(item: StockItem): void {
    if (confirm(`¿Desea eliminar el producto "${item.productName}"?`)) {
      this.stockItems = this.stockItems.filter(i => i.id !== item.id);
      this.groupStockItems();
    }
  }

  getNextId(): number {
    return this.stockItems.length ? Math.max(...this.stockItems.map(i => i.id)) + 1 : 1;
  }
}
