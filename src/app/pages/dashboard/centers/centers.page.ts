import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CenterItem {
  id: number;
  center: string;
  phoneNumber: string;
}

@Component({
    selector: 'app-centers-page',
    imports: [CommonModule],
    templateUrl: './centers.page.html',
    styleUrls: ['./centers.page.scss']
})
export class CentersPage implements OnInit {
  // Datos simulados de centros
  centers: CenterItem[] = [
    { id: 1, center: 'Centro 1', phoneNumber: '123-456-789' },
    { id: 2, center: 'Centro 2', phoneNumber: '987-654-321' },
    { id: 3, center: 'Centro 3', phoneNumber: '555-555-555' }
  ];
  filterTerm: string = '';

  constructor() {}

  ngOnInit(): void {}

  // Devuelve los centros filtrados según el término de búsqueda
  get filteredCenters(): CenterItem[] {
    if (!this.filterTerm) {
      return this.centers;
    }
    return this.centers.filter(c =>
      c.center.toLowerCase().includes(this.filterTerm.toLowerCase())
    );
  }

  onFilterChange(event: any): void {
    this.filterTerm = event.target.value;
  }

  addCenter(): void {
    const centerName = prompt('Ingrese el nombre del centro:');
    if (!centerName) return;
    const phone = prompt('Ingrese el número de teléfono:');
    const newCenter: CenterItem = {
      id: this.centers.length > 0 ? Math.max(...this.centers.map(c => c.id)) + 1 : 1,
      center: centerName,
      phoneNumber: phone || ''
    };
    this.centers.push(newCenter);
  }

  editCenter(center: CenterItem): void {
    const newName = prompt('Editar nombre del centro:', center.center);
    if (newName) {
      center.center = newName;
    }
    const newPhone = prompt('Editar número de teléfono:', center.phoneNumber);
    if (newPhone) {
      center.phoneNumber = newPhone;
    }
  }

  deleteCenter(center: CenterItem): void {
    if (confirm(`¿Desea eliminar el centro "${center.center}"?`)) {
      this.centers = this.centers.filter(c => c.id !== center.id);
    }
  }
}
