// src/app/pages/dashboard/centers/centers.page.ts
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  CentersService,
  CenterRead,
  CenterCreate,
  CenterUpdate,
} from '../../../services/centers.service';
import { CentersInventoryPage } from '../centers-inventory/centers-inventory.page';

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
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  centers: CenterRead[] = [];
  filterTerm = '';
  form!: FormGroup;
  editingId: number | null = null;

  constructor(
    private svc: CentersService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.load();
    this.form = this.fb.group({
      center: ['', Validators.required],
      phonenumber: ['', Validators.required],
    });
  }

  load() {
    this.svc.list().subscribe(list => (this.centers = list));
  }

  onFilterChange(e: any) {
    this.filterTerm = e.target.value;
  }

  get filteredCenters() {
    return this.centers.filter(c =>
      c.center.toLowerCase().includes(this.filterTerm.toLowerCase())
    );
  }

  openModal(c?: CenterRead) {
    this.editingId = c?.id ?? null;
    if (c) {
      this.form.patchValue(c);
    } else {
      this.form.reset();
    }
    this.modalService.open(this.modalContent, { size: 'md' });
  }

  save() {
    const payload: CenterCreate | CenterUpdate = this.form.value;
    const call = this.editingId
      ? this.svc.update(this.editingId, payload as CenterUpdate)
      : this.svc.create(payload as CenterCreate);

    call.subscribe(() => {
      this.modalService.dismissAll();
      this.load();
    });
  }

  deleteCenter(c: CenterRead) {
    if (!confirm(`¿Eliminar centro "${c.center}"?`)) return;
    this.svc.delete(c.id).subscribe(() => this.load());
  }

  openInventory(center: CenterRead) {
    const ref = this.modalService.open(CentersInventoryPage, {
      size: 'xl',
      backdrop: 'static',
    });
    ref.componentInstance.centerId = center.id;
    ref.componentInstance.centerName = center.center;
  }
}
