export interface ScoreInfo {
  student_id:     number;
  student_name:   string;
  course_id:      number;
  course_name:    string;
  score:          number;
}
export interface ScoresInfoResponse {
  success: boolean;
  message: string;
  scores_info: ScoreInfo[];
}