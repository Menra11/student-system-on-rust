export interface Course {
  course_id: number;
  course_name: string;
  credit: number;
  classroom: string;
  schedule: string;
  description: string;
}
export interface CourseResponse {
  CoursesInformation: Course[];
}