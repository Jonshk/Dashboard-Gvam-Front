import { Component, OnInit } from '@angular/core';

export interface Reception {
  id: number;
  receptionName: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-receptions-page',
  templateUrl: './receptions-page.component.html',
  styleUrls: ['./receptions-page.component.scss']
})
export class ReceptionsPage implements OnInit {
  receptions: Reception[] = [];
  
  constructor() {}

  ngOnInit(): void {
    // Datos simulados
    this.receptions = [
      { id: 1, receptionName: 'Recepción Centro 1', date: '2025-04-12', status: 'Completo' },
      { id: 2, receptionName: 'Recepción Centro 2', date: '2025-04-10', status: 'Pendiente' },
      { id: 3, receptionName: 'Recepción Centro 3', date: '2025-04-08', status: 'En Proceso' }
    ];
  }
  
  onFilterChange(event: any): void {
    // Implementa el filtro según necesites
  }

  addReception(): void {
    alert('Agregar Recepción');
  }
  
  editReception(reception: Reception): void {
    alert('Editar Recepción: ' + reception.receptionName);
  }
  
  deleteReception(reception: Reception): void {
    if (confirm(`¿Desea eliminar la recepción "${reception.receptionName}"?`)) {
      this.receptions = this.receptions.filter(r => r.id !== reception.id);
    }
  }
}
