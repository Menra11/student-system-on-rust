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
export interface CoursesResponse {
  Courses: Course[];
}