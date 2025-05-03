import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryDetailModalComponent } from './category-detail-modal.component';
import { ProductModalComponent } from './product-modal.component';

export interface StockItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  category: string;
}

export interface StockGroup {
  category: string;
  items: StockItem[];
}

@Component({
  selector: 'app-stock-page',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './stock-page.component.html',
  // Mientras no tengas el archivo, puedes remover o comentar la siguiente línea:
  // styleUrls: ['./stock-page.component.scss']
})
export class StockPageComponent implements OnChanges {
  @Input() stockData: StockItem[] = [];
  
  stockGroups: StockGroup[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stockData']) {
      this.groupStockItems();
    }
  }

  groupStockItems(): void {
    const groups: { [key: string]: StockItem[] } = {};
    this.stockData.forEach(item => {
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

  openCategoryDetail(category: string): void {
    this.dialog.open(CategoryDetailModalComponent, {
      width: '600px',
      data: { category, items: this.stockData.filter(item => item.category === category) }
    });
  }

  openProductModal(item?: StockItem): void {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '400px',
      data: { product: item ? { ...item } : null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item) {
          const index = this.stockData.findIndex(i => i.id === item.id);
          if (index > -1) {
            this.stockData[index] = result;
          }
        } else {
          result.id = this.getNextId();
          this.stockData.push(result);
        }
        this.groupStockItems();
      }
    });
  }

  deleteProduct(item: StockItem): void {
    if (confirm(`¿Desea eliminar el producto "${item.productName}"?`)) {
      this.stockData = this.stockData.filter(i => i.id !== item.id);
      this.groupStockItems();
    }
  }

  getNextId(): number {
    return this.stockData.length ? Math.max(...this.stockData.map(i => i.id)) + 1 : 1;
  }
}
