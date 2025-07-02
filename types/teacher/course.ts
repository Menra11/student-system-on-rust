export interface Course {
  course_id: number;
  course_name: string;
  credit: number;
  classroom: string;
  schedule: string;
  description: string;
}
export interface CoursesResponse {
  success: boolean;
  message: string;
  courses: Course[];
}
export interface CourseResponse {
  success: boolean;
  message: string;
  course: Course;
}

export interface CourseInfo {
  course_id: number;
  course_name: string;
  credit: number;
  classroom: string;
  schedule: string;
  description: string;
}
export interface CoursesInfoResponse {
  success: boolean;
  message: string;
  courses_info: CourseInfo[];
}
