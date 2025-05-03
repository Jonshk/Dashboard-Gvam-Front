export interface CreateDeviceUserRequest {
  name: string;
  email: string;
  password?: string | null;
}
