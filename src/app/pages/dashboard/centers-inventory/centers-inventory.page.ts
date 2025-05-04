// src/app/pages/dashboard/centers-inventory/centers-inventory.page.ts
import {
    Component,
    Input,
    OnInit,
    TemplateRef,
    ViewChild
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { NgbModal, NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
  import {
    CentersService,
    CenterStock,
    CenterStockCreate,
  } from '../../../services/centers.service';
  
  @Component({
    selector: 'app-centers-inventory-page',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule
    ],
    templateUrl: './centers-inventory.page.html',
    styleUrls: ['./centers-inventory.page.scss']
  })
  export class CentersInventoryPage implements OnInit {
    @Input() centerId!: number;
    @Input() centerName!: string;
  
    @ViewChild('stockModal', { static: true })
    stockModal!: TemplateRef<any>;
  
    inventory: CenterStock[] = [];
    form!: FormGroup;
    editingStockId: number | null = null;
  
    constructor(
      public activeModal: NgbActiveModal,
      private modalService: NgbModal,
      private svc: CentersService,
      private fb: FormBuilder
    ) {}
  
    ngOnInit() {
      this.load();
      this.form = this.fb.group({
        product_name: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        price: [0, [Validators.required, Validators.min(0)]],
        category: ['', Validators.required],
        estado: [''],
        image_path: [''],
      });
    }
  
    load() {
      this.svc.listStock(this.centerId)
        .subscribe(list => (this.inventory = list));
    }
  
    openStockModal(item?: CenterStock) {
      this.editingStockId = item?.id ?? null;
      if (item) {
        this.form.patchValue(item);
      } else {
        this.form.reset({ quantity: 1, price: 0 });
      }
      this.modalService.open(this.stockModal, { size: 'lg' });
    }
  
    saveStock() {
      const payload: CenterStockCreate = this.form.value;
      const call = this.editingStockId
        ? this.svc.updateStock(this.editingStockId, payload)
        : this.svc.addStock(this.centerId, payload);
  
      call.subscribe(() => {
        this.modalService.dismissAll();
        this.load();
      });
    }
  
    deleteStock(item: CenterStock) {
      if (!confirm(`¿Eliminar ítem "${item.product_name}"?`)) return;
      this.svc.deleteStock(item.id).subscribe(() => this.load());
    }
  
    onImportFile(e: any) {
      const file: File = e.target.files[0];
      if (file) {
        this.svc.importStock(this.centerId, file).subscribe(() => this.load());
      }
    }
  }
  