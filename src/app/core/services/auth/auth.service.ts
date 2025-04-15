import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { LoginRequest } from "../../models/request/login-request.model";
import { Response } from "../../models/response/response.model";
import { LoginResponse } from "../../models/response/login-response.model";
import { Observable } from "rxjs";
import { RegisterRequest } from "../../models/request/register-request.model";
import { TokenResponse } from "../../models/response/token-response.model";
import { StoreService } from "../store/store.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private ACCESS_TOKEN = "access_token";
  private REFRESH_TOKEN = "refresh_token";

  private url(path: string) {
    return `${environment.apiUrl}/${path}`;
  }

  constructor(private http: HttpClient, private storeService: StoreService) {}

  saveTokens(tokenResponse: TokenResponse) {
    this.storeService.save(this.ACCESS_TOKEN, tokenResponse.accessToken);
    this.storeService.save(this.REFRESH_TOKEN, tokenResponse.refreshToken);
  }

  getTokens(): TokenResponse | null {
    if (!this.hasTokens()) return null;

    return {
      accessToken: this.storeService.get(this.ACCESS_TOKEN)!,
      refreshToken: this.storeService.get(this.REFRESH_TOKEN)!,
    };
  }

  hasTokens(): boolean {
    return (
      this.storeService.get(this.ACCESS_TOKEN) != null &&
      this.storeService.get(this.REFRESH_TOKEN) != null
    );
  }

  login(loginRequest: LoginRequest): Observable<Response<LoginResponse>> {
    return this.http.post<Response<LoginResponse>>(
      this.url("auth/login"),
      loginRequest
    );
  }

  register(
    registerRequest: RegisterRequest
  ): Observable<Response<LoginResponse>> {
    return this.http.post<Response<LoginResponse>>(
      this.url("auth/register"),
      registerRequest
    );
  }

  refreshToken(refreshToken: string): Observable<Response<TokenResponse>> {
    return this.http.put<Response<TokenResponse>>(
      this.url(`auth/refresh-token?refreshToken=${refreshToken}`),
      {}
    );
  }
}
