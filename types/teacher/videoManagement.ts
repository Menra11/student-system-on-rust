export interface UploadVideoRes {
  success: boolean;
  message: string;
  filename: string;
}
export interface Video {
  video_title: string;
  video_description: string;
  video_url: string;
  video_duration: number;
  course_id: number;
}
export interface VideoResponse {
  Videos: Video[];
}
export interface AddVideoRo{
  video: Video,
  filename:string
}