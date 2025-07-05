// types/student.ts
export interface Student {
  student_id: number;
  student_name: string;
  gender: string;
  birth_date: string;
  class_id: number;
  class_name: string;
  phone: string;
  email: string;
}

export interface Class {
  class_id: number;
  class_name: string;
}

export interface Pagination {
  total: number;
  total_pages: number;
}

export interface StudentsResponse {
  success: boolean;
  message: string;
  students?: Student[];
}
export interface StudentResponse {
  success: boolean;
  message: string;
  student?: Student;
}

export interface ClassesResponse {
  success: boolean;
  message: string;
  classes?: Class[];
}

// [id]
export interface Score {
  score_id: number
  course_name: string
  credit: number
  teacher_name: string
  score: number | null
  semester: string
}
export interface StudentRes {
  success: boolean
  message?: string
  student?: Student
}
export interface ScoreRes {
  success: boolean
  message?: string
  scores?: Score[]
}
