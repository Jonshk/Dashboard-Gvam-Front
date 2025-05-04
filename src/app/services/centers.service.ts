// src/app/services/centers.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CenterRead {
  id: number;
  center: string;
  phonenumber: string;
}

export interface CenterCreate {
  center: string;
  phonenumber: string;
}

export interface CenterUpdate {
  center?: string;
  phonenumber?: string;
}

// Inventory
export interface CenterStock {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  category: string;
  estado: string;
  image_path?: string;
}

export interface CenterStockCreate {
  product_name: string;
  quantity: number;
  price: number;
  category: string;
  estado?: string;
  image_path?: string;
}

@Injectable({ providedIn: 'root' })
export class CentersService {
  private base = 'http://localhost:8000/centers';

  constructor(private http: HttpClient) {}

  list(): Observable<CenterRead[]> {
    return this.http.get<CenterRead[]>(`${this.base}/`);
  }
  create(payload: CenterCreate) {
    return this.http.post<CenterRead>(`${this.base}/`, payload);
  }
  update(id: number, payload: CenterUpdate) {
    return this.http.put<CenterRead>(`${this.base}/${id}`, payload);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // Inventory endpoints
  listStock(centerId: number) {
    return this.http.get<CenterStock[]>(
      `${this.base}/${centerId}/inventory`
    );
  }
  addStock(centerId: number, payload: CenterStockCreate) {
    return this.http.post<CenterStock>(
      `${this.base}/${centerId}/inventory`,
      payload
    );
  }
  updateStock(stockId: number, payload: CenterStockCreate) {
    return this.http.put<CenterStock>(
      `${this.base}/inventory/${stockId}`,
      payload
    );
  }
  deleteStock(stockId: number) {
    return this.http.delete<void>(`${this.base}/inventory/${stockId}`);
  }
  importStock(centerId: number, file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ imported: number }>(
      `${this.base}/${centerId}/inventory/import`,
      form
    );
  }
}
