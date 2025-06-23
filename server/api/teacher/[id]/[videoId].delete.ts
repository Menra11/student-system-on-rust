import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const video_id = event.context.params.videoId;
  // 删除id的视频
  const query = `DELETE FROM video WHERE video_id = ?`;
  const [Video] = await pool.query(query, [video_id]);
  return {
    Video: Video
  }
})
