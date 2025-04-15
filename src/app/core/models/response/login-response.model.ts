import { Role } from '../../enums/role';
import { TokenResponse } from './token-response.model';

export interface LoginResponse {
  email: string;
  role: Role;
  tokens: TokenResponse;
}
