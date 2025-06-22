import pool from "../../db";
import type { Video } from "@/types/teacher/videoManagement"
export default defineEventHandler(async (event) => {
  const video = await readBody<Video>(event);

  const query = `INSERT INTO video (video_title, video_description, video_url, video_duration, course_id)
VALUES 
(?, ?, ?, ?, ?);
  `
  await pool.query(query, [video.video_title, video.video_description, video.video_url, video.video_duration, video.course_id]);
  return {
    success: true,
    message: "数据库上传成功",
  };
});
