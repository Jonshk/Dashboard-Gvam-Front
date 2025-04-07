import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateGroup } from '../../models/request/create-group.model';
import { Response } from '../../models/response/response.model';
import { environment } from '../../../../environments/environment';
import { Group } from '../../models/response/group.model';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../../models/response/success-response.model';
import { EnterpriseService } from '../enterprise/enterprise.service';
import {
  getPaginationParams,
  NO_PAGINATION,
  Pagination,
} from '../../../shared/util/pagination';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private enterpriseId: string;

  private url(path: number | null = null) {
    return `${environment.apiUrl}/enterprises/${this.enterpriseId}/groups${path ? '/' + path : ''}`;
  }

  constructor(
    private http: HttpClient,
    private enterpriseService: EnterpriseService,
  ) {
    this.enterpriseId = this.enterpriseService.getEnterpriseId() as string;
  }

  create(createGroup: CreateGroup): Observable<Response<Group>> {
    return this.http.post<Response<Group>>(this.url(), createGroup);
  }

  update(
    groupId: number,
    updateGroup: CreateGroup,
  ): Observable<Response<Group>> {
    return this.http.patch<Response<Group>>(this.url(groupId), updateGroup);
  }

  list(pagination: Pagination = NO_PAGINATION): Observable<Response<Group[]>> {
    return this.http.get<Response<Group[]>>(this.url(), {
      params: getPaginationParams(pagination),
    });
  }

  find(groupId: number): Observable<Response<Group>> {
    return this.http.get<Response<Group>>(this.url(groupId));
  }

  delete(groupId: number): Observable<Response<SuccessResponse>> {
    return this.http.delete<Response<SuccessResponse>>(this.url(groupId));
  }
}
