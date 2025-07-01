import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  try {
    const student_id  = event.context.params.id;
    const video_id  = event.context.params.videoId;
    const { completed, progress} = getQuery(event);
    const query = `
  UPDATE student_video_progress
  SET progress = ?, completed = ?
  WHERE video_id =? AND student_id = ?;
  `;
    await pool.query(query, [progress, completed, video_id, student_id]);
    return {
      success: true,
      message: "进度更新成功",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
});
