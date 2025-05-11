import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {
  CentersService,
  CenterStockRead,
  CenterStockCreate,
  CenterStockUpdate
} from '../../../services/centers.service';

@Component({
  selector: 'app-centers-inventory-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule
  ],
  templateUrl: './centers-inventory.page.html',
  styleUrls: ['./centers-inventory.page.scss']
})
export class CentersInventoryPageComponent implements OnInit {
  @Input() center!: { id: number; center: string };

  tabs = ['Consumibles', 'Dispositivos'];
  selectedTab = this.tabs[0];

  inventory: CenterStockRead[] = [];
  filtered: CenterStockRead[] = [];

  form!: FormGroup;
  editingId: number | null = null;
  showForm = false;

  constructor(
    public modal: NgbActiveModal,
    private svc: CentersService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
    this.load();
  }

  private buildForm() {
    this.form = this.fb.group({
      product_name: ['', Validators.required],
      quantity:     [1, [Validators.required, Validators.min(1)]],
      price:        [0, [Validators.required, Validators.min(0)]],
      category:     ['', Validators.required],
      estado:       ['', Validators.required]
    });
  }

  private load() {
    this.svc.listStock(this.center.id).subscribe(list => {
      this.inventory = list;
      this.selectTab(this.selectedTab);
      this.showForm = false;
      this.editingId = null;
    });
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    // Filtramos según el nombre de la pestaña (asumiendo que categoria guarda 'consumible' o 'dispositivo')
    const key = tab.toLowerCase().slice(0, -1); // "Consumibles" → "consumible", "Dispositivos" → "dispositivo"
    this.filtered = this.inventory.filter(i => i.category === key);
    this.showForm = false;
  }

  addItem() {
    this.editingId = null;
    this.buildForm();
    // preseleccionamos la categoría según la pestaña
    this.form.patchValue({ category: this.selectedTab.toLowerCase().slice(0, -1) });
    this.showForm = true;
  }

  editItem(i: CenterStockRead) {
    this.editingId = i.id;
    this.form.patchValue(i);
    this.showForm = true;
  }

  deleteItem(i: CenterStockRead) {
    if (!confirm(`Eliminar "${i.product_name}"?`)) return;
    this.svc.deleteStock(i.id).subscribe(() => this.load());
  }

  save() {
    const payload = this.form.value as CenterStockCreate | CenterStockUpdate;
    const call = this.editingId
      ? this.svc.updateStock(this.editingId, payload as CenterStockUpdate)
      : this.svc.addStock(this.center.id, payload as CenterStockCreate);

    call.subscribe(() => this.load());
  }

  onImportFile(ev: Event) {
    const f = (ev.target as HTMLInputElement).files![0];
    this.svc.importStock(this.center.id, f).subscribe(() => this.load());
  }
}
