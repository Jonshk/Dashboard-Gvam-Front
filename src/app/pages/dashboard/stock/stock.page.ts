import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StockItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  imagePath?: string;
  category: 'consumible' | 'dispositivo';
  status?: string; // Para dispositivos, por ejemplo, 'funcional' o 'no funcional'
}

@Component({
  selector: 'app-stock-page',
  standalone: true,
  imports: [CommonModule],  // Se importa CommonModule para usar directivas y pipes básicos
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss']
})
export class StockPage implements OnInit {
  // Datos simulados de inventario
  stockItems: StockItem[] = [
    { id: 1, productName: 'Producto A', quantity: 50, price: 9.99, category: 'consumible' },
    { id: 2, productName: 'Producto B', quantity: 20, price: 19.99, category: 'dispositivo', status: 'funcional' },
    { id: 3, productName: 'Producto C', quantity: 100, price: 4.99, category: 'consumible' }
  ];
  nextId: number = 4; // Para asignar IDs a nuevos productos
  filterTerm: string = '';
  // Pestaña seleccionada: 'consumible' o 'dispositivo'
  selectedTab: 'consumible' | 'dispositivo' = 'consumible';

  constructor() {}

  ngOnInit(): void {}

  // Devuelve los ítems filtrados según la pestaña y el término de búsqueda
  get filteredItems(): StockItem[] {
    const items = this.stockItems.filter(item => item.category === this.selectedTab);
    if (this.filterTerm) {
      return items.filter(item =>
        item.productName.toLowerCase().includes(this.filterTerm.toLowerCase())
      );
    }
    return items;
  }

  setTab(tab: 'consumible' | 'dispositivo'): void {
    this.selectedTab = tab;
    this.filterTerm = ''; // Limpiar filtro al cambiar de pestaña
  }

  onFilterChange(event: any): void {
    this.filterTerm = event.target.value;
  }

  addProduct(): void {
    // Se simula la creación de un nuevo ítem usando prompt
    const name = prompt("Ingrese el nombre del producto:");
    if (!name) return;
    const qtyStr = prompt("Ingrese la cantidad:");
    const qty = qtyStr ? parseInt(qtyStr, 10) : 0;
    if (isNaN(qty) || qty <= 0) { 
      alert("Cantidad inválida");
      return;
    }
    const priceStr = prompt("Ingrese el precio:");
    const price = priceStr ? parseFloat(priceStr) : 0;
    if (isNaN(price) || price <= 0) { 
      alert("Precio inválido");
      return;
    }
    const categoryInput = prompt("Ingrese la categoría (consumible/dispositivo):", "consumible");
    if (!categoryInput || (categoryInput.toLowerCase() !== 'consumible' && categoryInput.toLowerCase() !== 'dispositivo')) {
      alert("Categoría inválida");
      return;
    }
    const category = categoryInput.toLowerCase() as 'consumible' | 'dispositivo';
    let status: string | undefined = undefined;
    if (category === 'dispositivo') {
      status = prompt("Ingrese el estado (funcional/no funcional):", "funcional") || "funcional";
    }
    const newItem: StockItem = {
      id: this.nextId++,
      productName: name,
      quantity: qty,
      price: price,
      category: category,
      status: status
    };
    this.stockItems.push(newItem);
  }

  editProduct(item: StockItem): void {
    // Se simula la edición usando prompt
    const name = prompt("Editar nombre del producto:", item.productName);
    if (name) {
      item.productName = name;
    }
    const qtyStr = prompt("Editar cantidad:", item.quantity.toString());
    const qty = qtyStr ? parseInt(qtyStr, 10) : item.quantity;
    if (!isNaN(qty)) {
      item.quantity = qty;
    }
    const priceStr = prompt("Editar precio:", item.price.toString());
    const price = priceStr ? parseFloat(priceStr) : item.price;
    if (!isNaN(price)) {
      item.price = price;
    }
    if (item.category === 'dispositivo') {
      const status = prompt("Editar estado (funcional/no funcional):", item.status || "funcional");
      if (status) {
        item.status = status;
      }
    }
  }

  deleteProduct(item: StockItem): void {
    if (confirm(`¿Desea eliminar el producto "${item.productName}"?`)) {
      this.stockItems = this.stockItems.filter(i => i.id !== item.id);
    }
  }

  importExcel(): void {
    // Stub para importar datos desde Excel
    alert("Funcionalidad de importar Excel no implementada en este stub.");
  }
}
