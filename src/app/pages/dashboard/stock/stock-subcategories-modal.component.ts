// src/app/pages/dashboard/stock/stock-subcategories-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockMainCategory, StockSubcategory } from './product.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Importa los módulos de Material que se usan en este componente:
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-stock-subcategories-modal',
    templateUrl: './stock-subcategories-modal.component.html',
    styleUrls: ['./stock-subcategories-modal.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule
    ]
})
export class StockSubcategoriesModalComponent implements OnInit {
  subcategoryForm!: FormGroup;
  editingSubcategory: StockSubcategory | null = null;
  displayedColumns: string[] = ['id', 'name', 'quantity', 'price', 'actions'];

  constructor(
    public dialogRef: MatDialogRef<StockSubcategoriesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StockMainCategory,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.subcategoryForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.subcategoryForm.valid) {
      if (this.editingSubcategory) {
        this.editingSubcategory.name = this.subcategoryForm.value.name;
        this.editingSubcategory.quantity = this.subcategoryForm.value.quantity;
        this.editingSubcategory.price = this.subcategoryForm.value.price;
        this.editingSubcategory = null;
      } else {
        const newSub: StockSubcategory = {
          id: Date.now(),
          ...this.subcategoryForm.value
        };
        this.data.subcategories.push(newSub);
      }
      this.subcategoryForm.reset({ name: '', quantity: 0, price: 0 });
    } else {
      this.subcategoryForm.markAllAsTouched();
    }
  }

  onEdit(sub: StockSubcategory): void {
    this.editingSubcategory = sub;
    this.subcategoryForm.patchValue({
      name: sub.name,
      quantity: sub.quantity,
      price: sub.price
    });
  }

  onDelete(sub: StockSubcategory): void {
    if (confirm(`¿Desea eliminar la subcategoría "${sub.name}"?`)) {
      this.data.subcategories = this.data.subcategories.filter(s => s.id !== sub.id);
    }
  }

  onClose(): void {
    this.dialogRef.close(this.data);
  }
}
