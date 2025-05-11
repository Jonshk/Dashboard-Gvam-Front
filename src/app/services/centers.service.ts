// src/app/services/centers.service.ts
import { Injectable }    from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { Observable }    from 'rxjs';

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

export interface CenterStockRead {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  category: string;
  estado: string;
}

export interface CenterStockCreate {
  product_name: string;
  quantity: number;
  price: number;
  category: string;
  estado: string;
}

export interface CenterStockUpdate {
  product_name?: string;
  quantity?: number;
  price?: number;
  category?: string;
  estado?: string;
}

@Injectable({ providedIn: 'root' })
export class CentersService {
  private base = 'http://localhost:8000/centers';

  constructor(private http: HttpClient) {}

  // === Centros ===
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

  // === Inventario por Centro ===
  listStock(centerId: number): Observable<CenterStockRead[]> {
    return this.http.get<CenterStockRead[]>(`${this.base}/${centerId}/inventory`);
  }
  addStock(centerId: number, payload: CenterStockCreate) {
    return this.http.post<CenterStockRead>(
      `${this.base}/${centerId}/inventory`,
      payload
    );
  }
  updateStock(stockId: number, payload: CenterStockUpdate) {
    return this.http.put<CenterStockRead>(
      `${this.base}/inventory/${stockId}`,
      payload
    );
  }
  deleteStock(stockId: number) {
    return this.http.delete<void>(`${this.base}/inventory/${stockId}`);
  }
  importStock(centerId: number, file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ imported: number }>(
      `${this.base}/${centerId}/inventory/import`,
      fd
    );
  }
}
