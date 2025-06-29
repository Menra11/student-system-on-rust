export interface loginData {
  user_id: number;
  password: string;
  user: string;
}
export interface LoginDataRequest {
  user_from: loginData;
}
export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  errorCode?: string;
}
