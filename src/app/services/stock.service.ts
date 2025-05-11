// src/app/services/stock.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// — Categorías globales —
export interface CategoryAPI {
  id:   number;
  name: string;
}

// — Subcategorías globales —
export interface SubcategoryAPI {
  id:          number;
  category_id: number;
  name:        string;
}

// — Ítems globales —
export interface StockItemAPI {
  id:             number;
  subcategory_id: number;
  product_name:   string;
  quantity:       number;
  price:          number;
  image_path?:    string;
  estado?:        string;
}

// Para crear o actualizar ítems globales
export interface StockItemCreateAPI {
  subcategory_id: number;
  product_name:   string;
  quantity:       number;
  price:          number;
  image_path?:    string;
  estado?:        string;
}

// — Ítems de stock de un centro —
export interface CenterStockItem {
  id:           number;
  center_id:    number;
  product_name: string;
  quantity:     number;
  price:        number;
  image_path?:  string;
  category:     string;
  estado?:      string;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly baseUrl = `${environment.apiUrl}/stock`;

  constructor(private http: HttpClient) {}

  // Categorías
  listCategories(): Observable<CategoryAPI[]> {
    return this.http.get<CategoryAPI[]>(`${this.baseUrl}/categories`);
  }

  // Subcategorías
  listSubcategories(): Observable<SubcategoryAPI[]> {
    return this.http.get<SubcategoryAPI[]>(`${this.baseUrl}/subcategories`);
  }

  // Ítems globales
  listItems(): Observable<StockItemAPI[]> {
    return this.http.get<StockItemAPI[]>(`${this.baseUrl}/items`);
  }

  // Stock de un centro específico
  getCenterStock(centerId: number): Observable<CenterStockItem[]> {
    return this.http.get<CenterStockItem[]>(
      `${this.baseUrl}/centers/${centerId}/items`
    );
  }

  // Crear un ítem global
  createItem(payload: StockItemCreateAPI): Observable<StockItemAPI> {
    return this.http.post<StockItemAPI>(`${this.baseUrl}/items`, payload);
  }

  // Actualizar un ítem global
  updateItem(id: number, payload: StockItemCreateAPI): Observable<StockItemAPI> {
    return this.http.put<StockItemAPI>(`${this.baseUrl}/items/${id}`, payload);
  }

  // Eliminar un ítem global
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${id}`);
  }
}
