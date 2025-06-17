export interface loginData{
  user_id: number,
  password: string,
  user:string
}
export interface LoginResponse {
  success: boolean;
  message?: string;
  errorCode?: string;
}