import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StockItemAPI {
  id: number;
  subcategory_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image_path?: string;
  estado?: string;
}

export interface StockItemCreateAPI {
  subcategory_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image_path?: string;
  estado?: string;
}

export interface SubcategoryAPI {
  id: number;
  category_id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly base = `${environment.apiUrl}/stock`;

  constructor(private http: HttpClient) {}

  listItems(): Observable<StockItemAPI[]> {
    return this.http.get<StockItemAPI[]>(`${this.base}/items`);
  }

  createItem(payload: StockItemCreateAPI): Observable<StockItemAPI> {
    return this.http.post<StockItemAPI>(
      `${this.base}/items`,
      payload
    );
  }

  updateItem(item: StockItemAPI): Observable<StockItemAPI> {
    return this.http.put<StockItemAPI>(
      `${this.base}/items/${item.id}`,
      item
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/items/${id}`);
  }

  /** Nuevo: lista todas las subcategorías */
  listSubcategories(): Observable<SubcategoryAPI[]> {
    return this.http.get<SubcategoryAPI[]>(`${this.base}/subcategories`);
  }
}
