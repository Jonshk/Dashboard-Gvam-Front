// src/app/pages/dashboard/stock/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// ---------------------------
// Interfaces de Modelo
// ---------------------------

// Modelo de Subcategoría (por ejemplo, para baterías, pantallas, etc.)
export interface StockSubcategory {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

// Modelo de Categoría Principal (representa un grupo o tipo de producto)
// Por ejemplo, "Baterías" puede ser una categoría que contiene diferentes marcas o modelos.
export interface StockMainCategory {
  id?: number; // Opcional porque al crear puede no existir aún
  name: string;
  type: 'insumos' | 'dispositivos' | 'repuestos';
  subcategories: StockSubcategory[];
}

// Modelos para Órdenes, Reparaciones y Recepciones

// Para Órdenes (pedidos)
export interface OrderItem {
  product_name: string;
  quantity: number;
}
export interface Order {
  id?: number;
  center_id: number;
  shipping_company: string;
  order_date: string; // Debe estar en formato YYYY-MM-DD
  items: OrderItem[];
}

// Para Reparaciones
export interface RepairItem {
  product_name: string;
  repair_quantity: number;
}
export interface Repair {
  id?: number;
  center_id: number;
  repair_type: string;
  repair_date: string; // Formato YYYY-MM-DD
  items: RepairItem[];
}

// Para Recepciones
export interface ReceptionItem {
  product_name: string;
  quantity: number;
}
export interface Reception {
  id?: number;
  center_id: number;
  reception_date: string; // Formato YYYY-MM-DD
  items: ReceptionItem[];
}

// ---------------------------
// Servicio para Gestión de Stock y Operaciones
// ---------------------------
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Define las URLs base para cada recurso
  private productsUrl = 'http://localhost:8000/api/products';
  private ordersUrl = 'http://localhost:8000/api/orders';
  private repairsUrl = 'http://localhost:8000/api/repairs';
  private receptionsUrl = 'http://localhost:8000/api/receptions';
  private reportsUrl = 'http://localhost:8000/api/reports'; // Ejemplo para informes

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------------------
  // MÉTODOS PARA PRODUCTOS (Stock)
  // -------------------------------------------------------------------

  // Obtiene la lista de categorías principales (cada una puede tener subcategorías)
  getProducts(): Observable<{ data: StockMainCategory[] }> {
    return this.http.get<{ data: StockMainCategory[] }>(this.productsUrl)
      .pipe(catchError(this.handleError));
  }

  // Crea una nueva categoría (con un arreglo de subcategorías vacío)
  createProduct(product: StockMainCategory): Observable<any> {
    return this.http.post<any>(this.productsUrl, product)
      .pipe(catchError(this.handleError));
  }

  // Actualiza una categoría existente; se requiere el ID para actualizar
  updateProduct(product: StockMainCategory): Observable<any> {
    if (!product.id) {
      return throwError(() => new Error('No se proporcionó el ID del producto a actualizar.'));
    }
    const url = `${this.productsUrl}/${product.id}`;
    return this.http.put<any>(url, product)
      .pipe(catchError(this.handleError));
  }

  // Elimina una categoría por su ID
  deleteProduct(productId: number): Observable<any> {
    const url = `${this.productsUrl}/${productId}`;
    return this.http.delete<any>(url)
      .pipe(catchError(this.handleError));
  }

  // Obtiene un producto (categoría) en particular, por su ID
  getProductById(productId: number): Observable<StockMainCategory> {
    const url = `${this.productsUrl}/${productId}`;
    return this.http.get<StockMainCategory>(url)
      .pipe(catchError(this.handleError));
  }

  // -------------------------------------------------------------------
  // MÉTODOS PARA ÓRDENES
  // -------------------------------------------------------------------
  getOrders(): Observable<{ data: Order[] }> {
    return this.http.get<{ data: Order[] }>(this.ordersUrl)
      .pipe(catchError(this.handleError));
  }

  createOrder(order: Order): Observable<any> {
    return this.http.post<any>(this.ordersUrl, order)
      .pipe(catchError(this.handleError));
  }

  updateOrder(order: Order): Observable<any> {
    if (!order.id) {
      return throwError(() => new Error('No se proporcionó el ID de la orden a actualizar.'));
    }
    const url = `${this.ordersUrl}/${order.id}`;
    return this.http.put<any>(url, order)
      .pipe(catchError(this.handleError));
  }

  deleteOrder(orderId: number): Observable<any> {
    const url = `${this.ordersUrl}/${orderId}`;
    return this.http.delete<any>(url)
      .pipe(catchError(this.handleError));
  }

  // -------------------------------------------------------------------
  // MÉTODOS PARA REPARACIONES
  // -------------------------------------------------------------------
  getRepairs(): Observable<{ data: Repair[] }> {
    return this.http.get<{ data: Repair[] }>(this.repairsUrl)
      .pipe(catchError(this.handleError));
  }

  createRepair(repair: Repair): Observable<any> {
    return this.http.post<any>(this.repairsUrl, repair)
      .pipe(catchError(this.handleError));
  }

  updateRepair(repair: Repair): Observable<any> {
    if (!repair.id) {
      return throwError(() => new Error('No se proporcionó el ID de la reparación a actualizar.'));
    }
    const url = `${this.repairsUrl}/${repair.id}`;
    return this.http.put<any>(url, repair)
      .pipe(catchError(this.handleError));
  }

  deleteRepair(repairId: number): Observable<any> {
    const url = `${this.repairsUrl}/${repairId}`;
    return this.http.delete<any>(url)
      .pipe(catchError(this.handleError));
  }

  // -------------------------------------------------------------------
  // MÉTODOS PARA RECEPCIONES
  // -------------------------------------------------------------------
  getReceptions(): Observable<{ data: Reception[] }> {
    return this.http.get<{ data: Reception[] }>(this.receptionsUrl)
      .pipe(catchError(this.handleError));
  }

  createReception(reception: Reception): Observable<any> {
    return this.http.post<any>(this.receptionsUrl, reception)
      .pipe(catchError(this.handleError));
  }

  updateReception(reception: Reception): Observable<any> {
    if (!reception.id) {
      return throwError(() => new Error('No se proporcionó el ID de la recepción a actualizar.'));
    }
    const url = `${this.receptionsUrl}/${reception.id}`;
    return this.http.put<any>(url, reception)
      .pipe(catchError(this.handleError));
  }

  deleteReception(receptionId: number): Observable<any> {
    const url = `${this.receptionsUrl}/${receptionId}`;
    return this.http.delete<any>(url)
      .pipe(catchError(this.handleError));
  }

  // -------------------------------------------------------------------
  // MÉTODOS PARA INFORMES (REPORTS)
  // -------------------------------------------------------------------
  // Este método se basa en que la API reciba parámetros (por ejemplo, fecha, centro, etc.)
  getReport(params: any): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(this.reportsUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // -------------------------------------------------------------------
  // MANEJO DE ERRORES
  // -------------------------------------------------------------------
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Errores en el lado del cliente
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Errores en el servidor
      errorMsg = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }
}
