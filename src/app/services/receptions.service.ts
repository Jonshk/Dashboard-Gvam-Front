// src/app/services/receptions.service.ts

import { Injectable } from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { environment }  from '../../environments/environment';

export interface ReceptionItem {
  product_name: string;
  quantity:     number;
}

export interface Reception {
  id:             number;
  center_id:      number;
  reception_date: string;
  items:          ReceptionItem[];
}

export interface ReceptionCreateDto {
  center_id:      number;
  reception_date: string;
  items:          ReceptionItem[];
}

export interface ReceptionUpdateDto {
  reception_date?: string;
  items?:          ReceptionItem[];
}

@Injectable({ providedIn: 'root' })
export class ReceptionsService {
  // Asegúrate de que apiUrl coincide con el CORS configurado en FastAPI:
  private baseUrl = `${environment.apiUrl}/receptions`;

  constructor(private http: HttpClient) {}

  /** Lista todas las recepciones */
  list(): Observable<Reception[]> {
    return this.http.get<Reception[]>(`${this.baseUrl}`);
  }

  /** Obtiene una recepción por ID */
  get(id: number): Observable<Reception> {
    return this.http.get<Reception>(`${this.baseUrl}/${id}`);
  }

  /** Crea una nueva recepción */
  create(payload: ReceptionCreateDto): Observable<Reception> {
    return this.http.post<Reception>(`${this.baseUrl}`, payload);
  }

  /** Actualiza una recepción existente */
  update(id: number, payload: ReceptionUpdateDto): Observable<Reception> {
    return this.http.put<Reception>(`${this.baseUrl}/${id}`, payload);
  }

  /** Elimina una recepción */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
