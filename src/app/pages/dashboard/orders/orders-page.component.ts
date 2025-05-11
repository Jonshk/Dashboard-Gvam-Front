// src/app/pages/dashboard/orders/orders-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';

import { CentersService, CenterRead } from '../../../services/centers.service';
import {
  StockService,
  StockItemAPI,
  CenterStockItem
} from '../../../services/stock.service';
import {
  OrdersService,
  Order,
  OrderCreateDto,
  OrderUpdateDto
} from '../../../services/orders.service';
import {
  ReceptionsService,
  Reception,
  ReceptionCreateDto
} from '../../../services/receptions.service';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    CommonModule,         // NgIf, NgFor, etc.
    FormsModule,          // ngModel, ngValue
    ReactiveFormsModule   // [formGroup], formArrayName, formGroupName…
  ],
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss']
})
export class OrdersPageComponent implements OnInit {
  // — Datos —
  centers: CenterRead[]               = [];
  products: StockItemAPI[]            = [];
  receptionProducts: CenterStockItem[] = [];
  carriers = ['DHL', 'FedEx', 'UPS', 'Correos'];

  sentOrders: Order[]     = [];
  receptions: Reception[] = [];

  // — Estado UI —
  isReceptionTab = false;
  filterTerm     = '';

  // — Formularios —
  orderForm!: FormGroup;
  receptionForm!: FormGroup;

  // — Modales —
  showOrderModal            = false;
  showReceptionModal        = false;
  showOrderDetailsModal     = false;
  showReceptionDetailsModal = false;

  // — Flags edición —
  isEditOrder     = false;
  isEditReception = false;

  // — Seleccionados para detalle/edición —
  selectedOrder?: Order;
  selectedReception?: Reception;

  // — Mensajes de error —
  orderErrorMsg     = '';
  receptionErrorMsg = '';

  constructor(
    private fb: FormBuilder,
    private centersSrv: CentersService,
    private stockSrv: StockService,
    private ordersSrv: OrdersService,
    private recpsSrv: ReceptionsService
  ) {}

  ngOnInit(): void {
    this.buildOrderForm();
    this.buildReceptionForm();
    this.loadCenters();
    this.loadProducts();
    this.loadSentOrders();
    this.loadReceptions();
  }

  // — Construcción de formularios —
  private buildOrderForm() {
    this.orderForm = this.fb.group({
      id:               [null],
      center_id:        [null, Validators.required],
      shipping_company: [null, Validators.required],
      order_date:       [null, Validators.required],
      status:           ['Pendiente', Validators.required],
      comments:         [''],
      items:            this.fb.array([], Validators.required)
    });
  }

  private buildReceptionForm() {
    this.receptionForm = this.fb.group({
      center_id:      [null, Validators.required],
      reception_date: [null, Validators.required],
      items:          this.fb.array([], Validators.required)
    });
    // recargar stock cuando cambie el centro emisor
    this.receptionForm.get('center_id')!
      .valueChanges.subscribe(cid => {
        if (cid) {
          this.loadReceptionProducts(cid);
          (this.receptionForm.get('items') as FormArray).clear();
        }
      });
  }

  // — Getters conveniencia para FormArray —
  get orderItems(): FormArray     { return this.orderForm.get('items') as FormArray; }
  get receptionItems(): FormArray { return this.receptionForm.get('items') as FormArray; }

  // — Cargadores de datos —
  private loadCenters()    { this.centersSrv.list().subscribe(cs => this.centers = cs); }
  private loadProducts()   { this.stockSrv.listItems().subscribe(ps => this.products = ps); }
  private loadSentOrders() { this.ordersSrv.list().subscribe(os => this.sentOrders = os); }
  private loadReceptions() { this.recpsSrv.list().subscribe(rr => this.receptions = rr); }
  private loadReceptionProducts(centerId: number) {
    this.stockSrv.getCenterStock(centerId)
      .subscribe(ps => this.receptionProducts = ps);
  }

  // — Pestañas y filtro —
  toggleTab(isRec: boolean) {
    this.isReceptionTab = isRec;
    this.filterTerm = '';
  }
  onFilterChange(e: Event) {
    this.filterTerm = (e.target as HTMLInputElement).value.trim().toLowerCase();
  }

  get filteredSentOrders(): Order[] {
    if (!this.filterTerm) return this.sentOrders;
    return this.sentOrders.filter(o =>
      o.id.toString().includes(this.filterTerm) ||
      this.getCenterName(o.center_id).toLowerCase().includes(this.filterTerm) ||
      o.shipping_company.toLowerCase().includes(this.filterTerm)
    );
  }

  get filteredReceptions(): Reception[] {
    if (!this.filterTerm) return this.receptions;
    return this.receptions.filter(r =>
      r.id.toString().includes(this.filterTerm) ||
      this.getCenterName(r.center_id).toLowerCase().includes(this.filterTerm)
    );
  }

  getCenterName(id: number): string {
    const c = this.centers.find(x => x.id === id);
    return c ? c.center : '—';
  }

  // — Envíos —  
  openOrderModal(o?: Order) {
    this.orderErrorMsg = '';
    this.isEditOrder = !!o;
    this.orderItems.clear();
    if (o) {
      this.orderForm.patchValue(o);
      o.items.forEach(it => this.orderItems.push(
        this.fb.group({
          product_name: [it.product_name, Validators.required],
          quantity:     [it.quantity,      [Validators.required, Validators.min(1)]]
        })
      ));
    } else {
      this.orderForm.reset({ id: null, status: 'Pendiente', comments: '' });
    }
    this.showOrderModal = true;
  }

  addOrderItem() {
    this.orderItems.push(this.fb.group({
      product_name: [null, Validators.required],
      quantity:     [1,    [Validators.required, Validators.min(1)]]
    }));
  }

  removeOrderItem(i: number) {
    this.orderItems.removeAt(i);
  }

  submitOrder() {
    if (this.orderForm.invalid) return;
    const raw = this.orderForm.value;
    const id  = raw.id as number | null;
    const dto = {
      center_id:        raw.center_id,
      shipping_company: raw.shipping_company,
      order_date:       raw.order_date,
      status:           raw.status,
      comments:         raw.comments,
      items:            raw.items
    } as OrderCreateDto | OrderUpdateDto;

    const call$ = id
      ? this.ordersSrv.update(id, dto as OrderUpdateDto)
      : this.ordersSrv.create(dto as OrderCreateDto);

    call$.subscribe({
      next: () => {
        this.loadSentOrders();
        this.showOrderModal = false;
      },
      error: e => this.orderErrorMsg = e.error?.detail || 'Error al guardar envío'
    });
  }

  deleteOrder(o: Order) {
    if (!confirm(`Eliminar envío #${o.id}?`)) return;
    this.ordersSrv.delete(o.id)
      .subscribe(() => this.loadSentOrders());
  }

  openOrderDetailsModal(o: Order) {
    this.selectedOrder = o;
    this.showOrderDetailsModal = true;
  }

  // — Recepciones —  
  openReceptionModal(r?: Reception) {
    this.receptionErrorMsg = '';
    this.isEditReception = !!r;
    this.receptionItems.clear();

    if (r) {
      this.receptionForm.patchValue({
        center_id:      r.center_id,
        reception_date: r.reception_date
      });
      r.items.forEach(it => this.receptionItems.push(
        this.fb.group({
          product_name: [it.product_name, Validators.required],
          quantity:     [it.quantity,      [Validators.required, Validators.min(1)]]
        })
      ));
    } else {
      this.receptionForm.reset({ center_id: null, reception_date: null });
    }

    this.showReceptionModal = true;
  }

  addReceptionItem() {
    this.receptionItems.push(this.fb.group({
      product_name: [null, Validators.required],
      quantity:     [1,    [Validators.required, Validators.min(1)]]
    }));
  }

  removeReceptionItem(i: number) {
    this.receptionItems.removeAt(i);
  }

  submitReception() {
    if (this.receptionForm.invalid) return;
    const dto = this.receptionForm.value as ReceptionCreateDto;
    this.recpsSrv.create(dto).subscribe({
      next: () => {
        this.loadReceptions();
        this.showReceptionModal = false;
      },
      error: e => this.receptionErrorMsg = e.error?.detail || 'Error al guardar recepción'
    });
  }

  deleteReception(r: Reception) {
    if (!confirm(`Eliminar recepción #${r.id}?`)) return;
    this.recpsSrv.delete(r.id)
      .subscribe(() => this.loadReceptions());
  }

  openReceptionDetailsModal(r: Reception) {
    this.selectedReception = r;
    this.showReceptionDetailsModal = true;
  }

  // — Cerrar todos los modales —  
  closeAllModals() {
    this.showOrderModal =
    this.showReceptionModal =
    this.showOrderDetailsModal =
    this.showReceptionDetailsModal = false;
  }
}
