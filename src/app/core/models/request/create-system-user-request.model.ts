export interface CreateSystemUserRequest {
  name: string;
  email: string;
  password?: string | null;
}
