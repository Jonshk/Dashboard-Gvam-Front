// src/app/services/centers.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

@Injectable({ providedIn: 'root' })
export class CentersService {
  // Apunta al endpoint real: /centers/centers
  private readonly base = `${environment.apiUrl}/centers/centers`;

  constructor(private http: HttpClient) {}

  list(): Observable<CenterRead[]> {
    return this.http.get<CenterRead[]>(`${this.base}/`);
  }

  get(id: number): Observable<CenterRead> {
    return this.http.get<CenterRead>(`${this.base}/${id}`);
  }

  create(payload: CenterCreate): Observable<CenterRead> {
    return this.http.post<CenterRead>(`${this.base}/`, payload);
  }

  update(id: number, payload: CenterUpdate): Observable<CenterRead> {
    return this.http.put<CenterRead>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
