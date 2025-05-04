import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  StockService,
  StockItemAPI,
  StockItemCreateAPI,
  SubcategoryAPI
} from '../../../services/stock.service';

@Component({
  selector: 'app-stock-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss']
})
export class StockPageComponent implements OnInit {
  @ViewChild('productModal', { static: true }) productModal!: TemplateRef<any>;

  tabs        = ['Repuestos', 'Dispositivos', 'Insumos'];
  selectedTab = this.tabs[0];

  items: StockItemAPI[]        = [];
  subcategories: SubcategoryAPI[] = [];

  form!: FormGroup;
  preview: string | null       = null;
  modalRef: any;

  constructor(
    private fb: FormBuilder,
    private stockSvc: StockService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id:              [null],
      subcategory_id:  [null, Validators.required],
      product_name:    ['', Validators.required],
      quantity:        [1, [Validators.required, Validators.min(1)]],
      price:           [0, [Validators.required, Validators.min(0)]],
      image_path:      [''],
      estado:          ['Operativo', Validators.required]
    });

    this.loadSubcategories();
    this.loadItems();
  }

  private loadSubcategories(): void {
    this.stockSvc.listSubcategories().subscribe({
      next: sc => this.subcategories = sc,
      error: err => console.error('Error cargando subcategorías', err)
    });
  }

  private loadItems(): void {
    this.stockSvc.listItems().subscribe({
      next: all => {
        // filtramos por pestaña en base al nombre de la subcategoría
        this.items = all.filter(i => {
          const sub = this.subcategories.find(s => s.id === i.subcategory_id);
          return sub?.name === this.selectedTab;
        });
      },
      error: err => console.error('Error cargando items', err)
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.loadItems();
  }

  openModal(item?: StockItemAPI): void {
    if (item) {
      this.form.patchValue(item);
      this.preview = item.image_path || null;
    } else {
      this.form.reset({
        id: null,
        subcategory_id: null,
        product_name: '',
        quantity: 1,
        price: 0,
        image_path: '',
        estado: 'Operativo'
      });
      this.preview = null;
    }

    this.modalRef = this.modalService.open(this.productModal, { centered: true, size: 'lg' });
    this.modalRef.result.finally(() => this.form.reset());
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
      this.form.patchValue({ image_path: this.preview });
    };
    reader.readAsDataURL(file);
  }

  save(): void {
    if (this.form.invalid) return;

    const value = this.form.value;
    const payload: StockItemCreateAPI & Partial<Pick<StockItemAPI, 'id'>> = {
      subcategory_id: value.subcategory_id,
      product_name:   value.product_name,
      quantity:       value.quantity,
      price:          value.price,
      image_path:     value.image_path,
      estado:         value.estado,
      id:             value.id
    };

    const obs = payload.id
      ? this.stockSvc.updateItem(payload as StockItemAPI)
      : this.stockSvc.createItem(payload as StockItemCreateAPI);

    obs.subscribe(() => {
      this.loadItems();
      this.modalRef.close();
    });
  }

  deleteItem(item: StockItemAPI): void {
    if (!confirm(`¿Eliminar "${item.product_name}"?`)) return;
    this.stockSvc.deleteItem(item.id).subscribe(() => this.loadItems());
  }
}
