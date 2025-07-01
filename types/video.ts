export interface Video {
  video_id: number;
  video_title: string;
  video_description: string;
  video_url: string;
  video_duration: number;
  teacher_name: string;
  course_name: string;
  completed?: boolean;
}

export interface Progress {
  progress_id: number;
  student_id: number;
  video_id: number;
  progress: number;
  completed: boolean;
}



export interface VideoResponse {
  success: boolean;
  message: string;
  video?: Video;
  progress?: Progress;
}

export interface VideosResponse {
  success: boolean;
  message: string;
  videos?: Video[];
  progresses?: Progress[];
}
