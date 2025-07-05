export interface Admin{
  admin_id: number;
  admin_name: string;
}
export interface AdminResponse {
  success: boolean;
  message: string;
  admin: Admin;
}