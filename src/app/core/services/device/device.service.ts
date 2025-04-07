import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  getPaginationParams,
  Pagination,
} from '../../../shared/util/pagination';
import { DeviceFilter } from '../../enums/device-filter';
import { ApplyDevicePolicyRequest } from '../../models/request/apply-device-policy-request.model';
import { DeviceCommandRequest } from '../../models/request/device-command-request.model';
import { DeviceCustomCommandRequest } from '../../models/request/device-custom-command-request.model';
import { EnrollDeviceRequest } from '../../models/request/enroll-device.model';
import { MigrateDeviceRequest } from '../../models/request/migrate-device-request';
import { CobrowseToken } from '../../models/response/cobrowse-token.model';
import { DeviceDetail } from '../../models/response/device-detail.model';
import { Device } from '../../models/response/device.model';
import { EnrollDeviceResponse } from '../../models/response/enroll-device-response.model';
import { RegisterDevice } from '../../models/response/register-device.model';
import { Response } from '../../models/response/response.model';
import { SuccessResponse } from '../../models/response/success-response.model';
import { EnterpriseService } from '../enterprise/enterprise.service';
import { OrderFilter } from '../../enums/order-filter';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private enterpriseId: string;

  private url(groupId: number, path: string | number | null = null) {
    return `${environment.apiUrl}/enterprises/${this.enterpriseId}/groups/${groupId}/devices${path ? '/' + path : ''}`;
  }

  private urlAll(path: string | number | null = null) {
    return `${environment.apiUrl}/enterprises/${this.enterpriseId}/devices${path ? '/' + path : ''}`;
  }

  constructor(
    private http: HttpClient,
    private enterpriseService: EnterpriseService,
  ) {
    this.enterpriseId = this.enterpriseService.getEnterpriseId() as string;
  }

  enroll(
    registerDevice: EnrollDeviceRequest,
  ): Observable<Response<EnrollDeviceResponse>> {
    return this.http.post<Response<EnrollDeviceResponse>>(
      this.urlAll('enroll'),
      registerDevice,
    );
  }

  update(
    deviceId: number,
    registerDevice: EnrollDeviceRequest,
  ): Observable<Response<Device>> {
    return this.http.patch<Response<Device>>(
      this.urlAll(deviceId),
      registerDevice,
    );
  }

  register(groupId: number | undefined): Observable<Response<RegisterDevice>> {
    const url =
      groupId !== undefined
        ? this.url(groupId, 'register')
        : this.urlAll('register');
    return this.http.post<Response<RegisterDevice>>(url, {});
  }

  list(
    groupId: number,
    filter: DeviceFilter,
    searchQuery: string,
    pagination: Pagination,
    order: OrderFilter = OrderFilter.ASC,
    orderBy: string = '',
  ): Observable<Response<Device[]>> {
    return this.http.get<Response<Device[]>>(this.url(groupId), {
      params: {
        ...getPaginationParams(pagination),
        filter: filter,
        searchQuery: searchQuery !== undefined ? searchQuery : '',
        order: order,
        orderBy: orderBy,
      },
    });
  }

  listAll(
    filter: DeviceFilter,
    searchQuery: string,
    pagination: Pagination,
    order: OrderFilter = OrderFilter.ASC,
    orderBy: string = '',
  ): Observable<Response<Device[]>> {
    return this.http.get<Response<Device[]>>(this.urlAll(), {
      params: {
        ...getPaginationParams(pagination),
        filter: filter,
        searchQuery: searchQuery !== undefined ? searchQuery : '',
        order: order,
        orderBy: orderBy,
      },
    });
  }

  find(deviceId: number): Observable<Response<DeviceDetail>> {
    return this.http.get<Response<DeviceDetail>>(this.urlAll(deviceId));
  }

  delete(
    deviceId: number,
    enrolled: boolean,
  ): Observable<Response<SuccessResponse>> {
    return this.http.delete<Response<SuccessResponse>>(this.urlAll(deviceId), {
      params: { enrolled },
    });
  }

  applyPolicy(
    groupId: number,
    deviceId: number,
    devicePolicyRequest: ApplyDevicePolicyRequest,
  ): Observable<Response<SuccessResponse>> {
    return this.http.post<Response<SuccessResponse>>(
      this.url(groupId, deviceId),
      devicePolicyRequest,
    );
  }

  sendCommand(
    deviceId: number,
    deviceCommandRequest: DeviceCommandRequest,
  ): Observable<Response<SuccessResponse>> {
    return this.http.post<Response<SuccessResponse>>(
      this.urlAll(deviceId + '/command'),
      deviceCommandRequest,
    );
  }

  sendCustomCommand(
    deviceId: number,
    deviceCustomCommandRequest: DeviceCustomCommandRequest,
  ): Observable<Response<SuccessResponse>> {
    return this.http.post<Response<SuccessResponse>>(
      this.urlAll(deviceId + '/command/custom'),
      deviceCustomCommandRequest,
    );
  }

  migrate(
    deviceId: number,
    migrateDeviceRequest: MigrateDeviceRequest,
  ): Observable<Response<SuccessResponse>> {
    return this.http.post<Response<SuccessResponse>>(
      this.urlAll(deviceId + '/migrate'),
      migrateDeviceRequest,
    );
  }

  getCowbroseToken(deviceId: number): Observable<Response<CobrowseToken>> {
    return this.http.get<Response<CobrowseToken>>(
      this.urlAll(deviceId + '/remote-control/token'),
    );
  }
}
