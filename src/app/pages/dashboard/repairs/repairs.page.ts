import { Component, OnInit } from '@angular/core';

export interface Repair {
  id: number;
  device: string;
  description: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-repairs-page',
  templateUrl: './repairs-page.component.html',
  styleUrls: ['./repairs-page.component.scss']
})
export class RepairsPage implements OnInit {
  repairs: Repair[] = [];
  
  constructor() {}

  ngOnInit(): void {
    // Datos simulados
    this.repairs = [
      { id: 1, device: 'iPhone 12', description: 'Pantalla rota', status: 'En reparación', date: '2025-04-10' },
      { id: 2, device: 'Samsung Galaxy S21', description: 'Batería agotada', status: 'Pendiente', date: '2025-04-12' },
      { id: 3, device: 'Xiaomi Mi 11', description: 'Problemas de software', status: 'Reparado', date: '2025-04-08' }
    ];
  }

  onFilterChange(event: any): void {
    // Implementa filtro si lo requieres
  }

  addRepair(): void {
    alert('Agregar Reparación');
  }

  editRepair(repair: Repair): void {
    alert('Editar Reparación: ' + repair.device);
  }

  deleteRepair(repair: Repair): void {
    if (confirm(`¿Desea eliminar la reparación del dispositivo ${repair.device}?`)) {
      this.repairs = this.repairs.filter(r => r.id !== repair.id);
    }
  }
}
