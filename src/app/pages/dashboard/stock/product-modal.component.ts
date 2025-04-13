import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { StockItem } from './stock-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface ProductModalData {
  product: StockItem | null;
}

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './product-modal.component.html',
  // Si no cuentas con el archivo SCSS, elimina o comenta esta línea:
  // styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductModalData
  ) {
    this.productForm = this.fb.group({
      productName: [data.product ? data.product.productName : '', Validators.required],
      quantity: [data.product ? data.product.quantity : 0, [Validators.required, Validators.min(0)]],
      price: [data.product ? data.product.price : 0, [Validators.required, Validators.min(0)]],
      category: [data.product ? data.product.category : '', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
