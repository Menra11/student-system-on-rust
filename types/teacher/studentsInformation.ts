export interface StudentsInfo {
  student_id: number;
  student_name: string;
  course_name: string;
  class_name: string;
}
export interface StudentsInfoResponse {
  success: boolean;
  message: string;
  students_info: StudentsInfo[];
}
