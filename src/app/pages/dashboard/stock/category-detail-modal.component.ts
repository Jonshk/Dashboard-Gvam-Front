import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { StockItem } from './stock-page.component';

export interface CategoryDetailData {
  category: string;
  items: StockItem[];
}

@Component({
  selector: 'app-category-detail-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './category-detail-modal.component.html',
  // Si no creas el archivo SCSS, comenta o elimina styleUrls:
  // styleUrls: ['./category-detail-modal.component.scss']
})
export class CategoryDetailModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CategoryDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDetailData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
