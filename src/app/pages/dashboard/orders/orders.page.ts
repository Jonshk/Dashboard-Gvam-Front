import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para los pipes, entre otros

export interface Order {
  id: number;
  orderNumber: string;
  client: string;
  total: number;
  status: string;
  date: string;
}

@Component({
  selector: 'app-orders-page',
  standalone: true,  // Asegúrate de que es un componente standalone
  imports: [CommonModule],  // Agrega CommonModule para que el pipe currency esté disponible
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss']
})
export class OrdersPage implements OnInit {
  orders: Order[] = [];

  constructor() {}

  ngOnInit(): void {
    // Datos simulados
    this.orders = [
      { id: 1, orderNumber: 'ORD-001', client: 'Cliente A', total: 120.50, status: 'Pendiente', date: '2025-04-12' },
      { id: 2, orderNumber: 'ORD-002', client: 'Cliente B', total: 230.00, status: 'Procesado', date: '2025-04-11' },
      { id: 3, orderNumber: 'ORD-003', client: 'Cliente C', total: 75.00, status: 'Cancelado', date: '2025-04-10' }
    ];
  }

  onFilterChange(event: any): void {
    // Implementa filtro si se requiere
  }

  addOrder(): void {
    alert('Agregar Pedido');
  }

  editOrder(order: Order): void {
    alert('Editar Pedido: ' + order.orderNumber);
  }

  deleteOrder(order: Order): void {
    if (confirm(`¿Desea eliminar la orden ${order.orderNumber}?`)) {
      this.orders = this.orders.filter(o => o.id !== order.id);
    }
  }
}
