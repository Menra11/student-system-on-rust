export interface UploadVideoRes {
  success: boolean;
  message: string;
  filename: string;
}
export interface CourseVideos {
  video_id: number;
  video_title: string;
  video_description: string;
  video_url: string;
  video_duration: number;
  course_id: number;
}
export interface CourseVideosResponse {
  success: boolean;
  message: string;
  course_videos: CourseVideos[];
}
export interface AddVideoRo{
  video: CourseVideos,
  filename:string
}