import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SuccessResponse } from '../../models/response/success-response.model';
import { EnterpriseService } from '../enterprise/enterprise.service';
import { Response } from '../../models/response/response.model';
import { CreateSystemUserRequest } from '../../models/request/create-system-user-request.model';
import { SystemUser } from '../../models/response/system-user.model';
import {
  getPaginationParams,
  Pagination,
} from '../../../shared/util/pagination';

@Injectable({
  providedIn: 'root',
})
export class SystemUserService {
  private enterpriseId: string;

  private url(path: number | null = null) {
    return `${environment.apiUrl}/enterprises/${this.enterpriseId}/system-users${path ? '/' + path : ''}`;
  }

  constructor(
    private http: HttpClient,
    private enterpriseService: EnterpriseService,
  ) {
    this.enterpriseId = this.enterpriseService.getEnterpriseId() as string;
  }

  create(
    createSystemUser: CreateSystemUserRequest,
  ): Observable<Response<SystemUser>> {
    return this.http.post<Response<SystemUser>>(this.url(), createSystemUser);
  }

  patch(
    deviceUserId: number,
    createSystemUser: CreateSystemUserRequest,
  ): Observable<Response<SystemUser>> {
    return this.http.patch<Response<SystemUser>>(
      this.url(deviceUserId),
      createSystemUser,
    );
  }

  list(pagination: Pagination): Observable<Response<SystemUser[]>> {
    return this.http.get<Response<SystemUser[]>>(this.url(), {
      params: getPaginationParams(pagination),
    });
  }

  delete(deviceUserId: number): Observable<Response<SuccessResponse>> {
    return this.http.delete<Response<SuccessResponse>>(this.url(deviceUserId));
  }
}
