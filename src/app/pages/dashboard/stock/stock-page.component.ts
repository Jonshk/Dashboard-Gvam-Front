// stock-page.component.ts

import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductService, StockMainCategory } from './product.service';
import { StockSubcategoriesModalComponent } from './stock-subcategories-modal.component';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss'],
  providers: [DialogService] // Se declara el DialogService para usar dialogs de PrimeNG
})
export class StockPageComponent implements OnInit {
  activeTab: string = 'insumos';
  insumos: StockMainCategory[] = [];
  repuestos: StockMainCategory[] = [];
  dispositivos: StockMainCategory[] = [];

  constructor(
    private productService: ProductService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadStock();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  loadStock(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        const all = res.data;
        this.insumos = all.filter(p => p.type === 'insumos');
        this.repuestos = all.filter(p => p.type === 'repuestos');
        this.dispositivos = all.filter(p => p.type === 'dispositivos');
      },
      error: (err) => {
        alert('Error al cargar stock: ' + err);
      }
    });
  }

  openSubcategoriesModal(category: StockMainCategory): void {
    const ref = this.dialogService.open(StockSubcategoriesModalComponent, {
      header: 'Subcategorías',
      width: '600px',
      data: category
    });

    ref.onClose.subscribe((result: any) => {
      if (result) {
        this.loadStock();
      }
    });
  }

  editMainCategory(category: StockMainCategory): void {
    const newName = prompt('Edite el nombre de la categoría:', category.name);
    if (newName && newName.trim() !== '') {
      category.name = newName.trim();
      this.productService.updateProduct(category).subscribe({
        next: () => this.loadStock(),
        error: (err) => console.error('Error al actualizar categoría:', err)
      });
    }
  }

  deleteMainCategory(category: StockMainCategory): void {
    if (category.id && confirm(`¿Desea eliminar la categoría "${category.name}"?`)) {
      this.productService.deleteProduct(category.id).subscribe({
        next: () => this.loadStock(),
        error: (err) => console.error('Error al eliminar categoría:', err)
      });
    }
  }
}
