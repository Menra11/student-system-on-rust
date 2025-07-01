export interface Course {
  course_id: number;
  course_name: string;
  credit: number;
  teacher_id: number;
  classroom: string;
  schedule: string;
  description: string;
  video_id: number;
}

export interface CourseRequest {
  courses: Course[];
}

export interface CoursesResponse {
  success: boolean;
  message: string;
  courses?: Course[];
}

export interface CourseSelectResponse {
  success: boolean;
  message: string;
}