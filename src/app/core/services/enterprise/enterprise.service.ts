import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../models/response/response.model';
import { Enterprise } from '../../models/response/enterprise-response.model';
import { environment } from '../../../../environments/environment';
import { SignUpUrl } from '../../models/response/sign-up-url.model';
import { CreateEnterprise } from '../../models/request/create-enterprise.model';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class EnterpriseService {
  private url(path: string | null = null): string {
    return `${environment.apiUrl}/enterprises${path ? '/' + path : ''}`;
  }

  constructor(
    private http: HttpClient,
    private storeService: StoreService,
  ) {}

  signUp(): Observable<Response<SignUpUrl>> {
    return this.http.get<Response<SignUpUrl>>(this.url('signup'));
  }

  create(createEnterpriseRequest: CreateEnterprise) {
    return this.http.post<Response<Enterprise>>(
      this.url(),
      createEnterpriseRequest,
    );
  }

  list(): Observable<Response<Enterprise[]>> {
    return this.http.get<Response<Enterprise[]>>(this.url());
  }

  setEnterpriseId(enterpriseId: string | boolean) {
    this.storeService.save('enterpriseId', enterpriseId);
  }

  getEnterpriseId(): string | boolean | null {
    return this.storeService.get('enterpriseId');
  }
}
