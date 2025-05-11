// src/app/services/orders.service.ts

import { Injectable } from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { environment }  from '../../environments/environment';

export interface OrderItem { product_name: string; quantity: number; }
export interface Order    { id: number; center_id: number; shipping_company: string;
                           order_date: string; status: string; comments?: string;
                           items: OrderItem[]; }
export interface OrderCreateDto extends Omit<Order, 'id'> {}
export interface OrderUpdateDto { shipping_company?: string; order_date?: string;
                                  status?: string; comments?: string;
                                  items?: OrderItem[]; }

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  list(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/`);
  }
  get(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }
  create(payload: OrderCreateDto): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/`, payload);
  }
  update(id: number, payload: OrderUpdateDto): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
