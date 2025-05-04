// src/app/pages/dashboard/centers/centers.page.ts
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  CentersService,
  CenterRead,
  CenterCreate,
  CenterUpdate
} from '../../../services/centers.service';

@Component({
  selector: 'app-centers-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './centers.page.html',
  styleUrls: ['./centers.page.scss']
})
export class CentersPageComponent implements OnInit {
  centers: CenterRead[] = [];
  form!: FormGroup;
  modalTitle = '';
  editing?: CenterRead;
  private modalRef!: NgbModalRef;

  @ViewChild('centerModal', { static: true }) centerModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private centersSvc: CentersService,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      center: ['', Validators.required],
      phonenumber: ['', Validators.required]
    });
    this.load();
  }

  load(): void {
    this.centersSvc.list().subscribe(list => (this.centers = list));
  }

  openAdd(): void {
    this.editing = undefined;
    this.modalTitle = 'Agregar Centro';
    this.form.reset();
    this.modalRef = this.modal.open(this.centerModal, { centered: true });
  }

  openEdit(c: CenterRead): void {
    this.editing = c;
    this.modalTitle = 'Editar Centro';
    this.form.patchValue({
      center: c.center,
      phonenumber: c.phonenumber
    });
    this.modalRef = this.modal.open(this.centerModal, { centered: true });
  }

  delete(c: CenterRead): void {
    if (!confirm(`¿Eliminar el centro "${c.center}"?`)) return;
    this.centersSvc.delete(c.id).subscribe(() => this.load());
  }

  save(): void {
    if (this.form.invalid) return;
    const payload: CenterCreate = this.form.value;
    if (this.editing) {
      this.centersSvc
        .update(this.editing.id, payload as CenterUpdate)
        .subscribe(() => {
          this.load();
          this.modalRef.close();
        });
    } else {
      this.centersSvc.create(payload).subscribe(() => {
        this.load();
        this.modalRef.close();
      });
    }
  }
}
