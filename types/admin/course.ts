export interface Course {
  course_id: number;
  course_name: string;
  credit: number;
  teacher_name: string;
  classroom: string;
  schedule: string;
  description: string;
}
export interface Video {
  video_id: number;
  video_title: string;
  video_description: string;
  video_duration: number;
  video_url: string;
}
export interface CoursesResponse {
  Courses: Course[];
}
export interface CourseResponse {
  Course: Course;
}
export interface CourseInfoResponse { 
  success: boolean;
  message: string;
  course: Course;
  videos: Video[];
}
