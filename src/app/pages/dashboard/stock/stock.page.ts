import { Component, OnInit } from '@angular/core';
import { MatDialog }         from '@angular/material/dialog';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';

import { CategoryDetailModalComponent } from './category-detail-modal.component';
import { ProductModalComponent }        from './product-modal.component';

export interface StockItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  category: string;
}

@Component({
  selector: 'app-stock-page',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss']
})
export class StockPageComponent implements OnInit {
  // Datos de ejemplo
  stockItems: StockItem[] = [
    { id: 1, productName: 'Batería modelo A', quantity: 50, price: 9.99,  category: 'Repuestos'    },
    { id: 2, productName: 'Pantalla LCD X',  quantity: 20, price: 49.99, category: 'Dispositivos' },
    { id: 3, productName: 'Cable USB',        quantity: 100, price: 2.50, category: 'Consumibles'  }
    // …más ítems si quieres
  ];

  // Tres pestañas fijas
  tabs: string[] = ['Repuestos', 'Dispositivos', 'Consumibles'];
  selectedTab = this.tabs[0];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  get filteredItems(): StockItem[] {
    return this.stockItems.filter(i => i.category === this.selectedTab);
  }

  addProduct() {
    const name = prompt('Nombre del producto:');
    if (!name) return;

    const qtyStr   = prompt('Cantidad:') || '0';
    const priceStr = prompt('Precio:')   || '0';

    const newItem: StockItem = {
      id: this.stockItems.length
        ? Math.max(...this.stockItems.map(i => i.id)) + 1
        : 1,
      productName: name,
      quantity:    parseInt(qtyStr,   10),
      price:       parseFloat(priceStr),
      category:    this.selectedTab
    };
    this.stockItems.push(newItem);
  }

  editProduct(item: StockItem) {
    const name    = prompt('Editar nombre:',   item.productName);
    const qty     = prompt('Editar cantidad:', item.quantity.toString());
    const price   = prompt('Editar precio:',   item.price.toString());

    if (name  !== null) item.productName = name;
    if (qty   !== null) item.quantity    = parseInt(qty, 10);
    if (price !== null) item.price       = parseFloat(price);
  }

  deleteProduct(item: StockItem) {
    if (confirm(`¿Eliminar "${item.productName}"?`)) {
      this.stockItems = this.stockItems.filter(i => i.id !== item.id);
    }
  }
}
