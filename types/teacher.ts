export interface Teacher {
  teacher_id: number;
  teacher_name: string;
  gender?: string;
  title?: string;
  birth_date?: string;
  phone?: string;
  email?: string;
}
export interface TeacherResponse {
  success: boolean;
  message: string;
  teacher?: Teacher;
}
export interface TeachersResponse {
  success: boolean;
  message: string;
  teachers?: Teacher[];
}
