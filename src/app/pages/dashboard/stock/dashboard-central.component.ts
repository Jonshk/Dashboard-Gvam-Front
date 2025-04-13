import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { StockPageComponent, StockItem } from './stock-page.component';

interface Centro {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-dashboard-central',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, MatButtonModule, StockPageComponent],
  template: `
    <div class="dashboard-central">
      <h1>Dashboard Central</h1>
      <mat-form-field appearance="fill">
        <mat-label>Selecciona un Centro</mat-label>
        <mat-select [(value)]="centroSeleccionado" (selectionChange)="onCentroChange()">
          <mat-option *ngFor="let centro of centros" [value]="centro">
            {{ centro.nombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      
      <!-- Se muestra el componente de stock con los datos correspondientes -->
      <app-stock-page [stockData]="stockData"></app-stock-page>
      
      <div class="export-area">
        <button mat-raised-button color="primary" (click)="exportToExcel()">Exportar a Excel</button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-central { padding: 1rem; }
    .export-area { margin-top: 1rem; }
  `]
})
export class DashboardCentralComponent {
  centros: Centro[] = [
    { id: 1, nombre: 'Oficina Central' },
    { id: 2, nombre: 'Centro Sevilla' },
    { id: 3, nombre: 'Centro Madrid' }
  ];
  centroSeleccionado: Centro = this.centros[0];
  
  // Datos simulados para cada centro
  stockData: StockItem[] = [];
  
  constructor() {
    this.loadStockData();
  }

  onCentroChange(): void {
    this.loadStockData();
  }

  loadStockData(): void {
    // Simulación de carga de datos según el centro seleccionado.
    if (this.centroSeleccionado.id === 1) {
      this.stockData = [
        { id: 1, productName: 'Batería Modelo A', quantity: 50, price: 9.99, category: 'Baterías' },
        { id: 2, productName: 'Pantalla LCD Samsung', quantity: 30, price: 99.99, category: 'Pantallas LCD' }
      ];
    } else if (this.centroSeleccionado.id === 2) {
      this.stockData = [
        { id: 3, productName: 'Batería Modelo B', quantity: 20, price: 19.99, category: 'Baterías' },
        { id: 4, productName: 'Dispositivo Audio X', quantity: 15, price: 49.99, category: 'Dispositivos de Audio' }
      ];
    } else {
      this.stockData = [
        { id: 5, productName: 'Pantalla LCD Xiaomi', quantity: 25, price: 89.99, category: 'Pantallas LCD' },
        { id: 6, productName: 'TPV Modelo Z', quantity: 10, price: 199.99, category: 'TPV y Portátiles' }
      ];
    }
  }

  exportToExcel(): void {
    // Stub: Funcionalidad de exportación a Excel.
    console.log('Exportando datos del centro:', this.centroSeleccionado, this.stockData);
    alert('Funcionalidad de exportar a Excel no implementada en este stub.');
  }
}
