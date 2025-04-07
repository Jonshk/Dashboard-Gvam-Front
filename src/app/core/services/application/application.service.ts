import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EnterpriseService } from '../enterprise/enterprise.service';
import { Response } from '../../models/response/response.model';
import { CreateApplication } from '../../models/response/create-application';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private enterpriseId: string;

  private url(path: number | null = null) {
    return `${environment.apiUrl}/enterprises/${this.enterpriseId}/applications${path ? '/' + path : ''}`;
  }

  constructor(
    private http: HttpClient,
    private enterpriseService: EnterpriseService,
  ) {
    this.enterpriseId = this.enterpriseService.getEnterpriseId() as string;
  }

  createApplicationToken(): Observable<Response<CreateApplication>> {
    return this.http.post<Response<CreateApplication>>(this.url(), {});
  }
}
