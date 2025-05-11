// src/app/pages/dashboard/centers/centers.page.ts
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  CentersService,
  CenterRead,
  CenterCreate,
  CenterUpdate
} from '../../../services/centers.service';

// Importa también el componente de inventario si lo usas como modal de componente
import { CentersInventoryPageComponent } from '../centers-inventory/centers-inventory.page';

@Component({
  selector: 'app-centers-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  templateUrl: './centers.page.html',
  styleUrls: ['./centers.page.scss']
})
export class CentersPageComponent implements OnInit {
  centers: CenterRead[] = [];
  form!: FormGroup;
  editingId: number | null = null;
  filterTerm = '';

  /** Capturamos el ng-template que define el formulario */
  @ViewChild('formModalTpl', { static: true })
  formModalTpl!: TemplateRef<any>;

  constructor(
    private svc: CentersService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.load();
    this.form = this.fb.group({
      center:      ['', Validators.required],
      phonenumber: ['', Validators.required]
    });
  }

  private load() {
    this.svc.list().subscribe(list => this.centers = list);
  }

  get filteredCenters() {
    const term = this.filterTerm.toLowerCase();
    return this.centers.filter(c =>
      c.center.toLowerCase().includes(term)
    );
  }

  onFilterChange(e: Event) {
    this.filterTerm = (e.target as HTMLInputElement).value;
  }

  addCenter() {
    this.editingId = null;
    this.form.reset();
    this.openFormModal();
  }

  editCenter(c: CenterRead) {
    this.editingId = c.id;
    this.form.patchValue(c);
    this.openFormModal();
  }

  deleteCenter(c: CenterRead) {
    if (!confirm(`¿Eliminar "${c.center}"?`)) return;
    this.svc.delete(c.id).subscribe(() => this.load());
  }

  /** Abre el modal usando el TemplateRef capturado por ViewChild */
  private openFormModal() {
    const ref = this.modalService.open(this.formModalTpl, {
      centered: true,
      size: 'xl'
    });
    ref.result.finally(() => {
      this.form.reset();
      this.editingId = null;
    });
  }

  save() {
    const payload = this.form.value as CenterCreate | CenterUpdate;
    const call = this.editingId
      ? this.svc.update(this.editingId, payload as CenterUpdate)
      : this.svc.create(payload as CenterCreate);

    call.subscribe(() => {
      this.load();
      this.modalService.dismissAll();
    });
  }

  /** Modal de inventario (componente separado) */
  openInventory(c: CenterRead) {
    const ref = this.modalService.open(CentersInventoryPageComponent, {
      centered: true,
      size: 'xl'
    });
    ref.componentInstance.center = c;
  }
}
