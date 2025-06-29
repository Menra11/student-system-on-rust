export interface RegisterData {
  student_id: number;
  student_name: string;
  gender: string;
  birth_date: string;
  class_id: number;
  phone: string;
  email: string;
  password: string;
}

export interface RegisterRequest {
  user_from: RegisterData;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}
