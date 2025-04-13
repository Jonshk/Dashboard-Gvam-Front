import { Component, OnInit } from '@angular/core';

export interface Report {
  id: number;
  title: string;
  date: string;
  summary: string;
}

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.html',
  styleUrls: ['./reports-page.component.scss']
})
export class ReportsPage implements OnInit {
  reports: Report[] = [];
  
  constructor() {}

  ngOnInit(): void {
    // Datos simulados
    this.reports = [
      { id: 1, title: 'Reporte Mensual', date: '2025-04-01', summary: 'Resumen de ventas y reparaciones.' },
      { id: 2, title: 'Reporte Semanal', date: '2025-04-07', summary: 'Resumen semanal de stock.' },
      { id: 3, title: 'Reporte Diario', date: '2025-04-13', summary: 'Resumen diario de órdenes.' }
    ];
  }

  onFilterChange(event: any): void {
    // Implementa el filtro según se requiera
  }

  viewReport(report: Report): void {
    alert('Ver detalle del reporte: ' + report.title);
  }
  
  generateReport(): void {
    // Acción para generar reporte (stub)
    alert('Generando Reporte...');
  }
}
