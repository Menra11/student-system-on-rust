import pool from "../../db";
export default defineEventHandler(async (event) => {
  try {
    const { completed, progress, id, student_id } = getQuery(event);
    const query = `
  UPDATE student_video_progress
  SET progress = ?, completed = ?
  WHERE video_id =? AND student_id = ?;
  `;
    await pool.query(query, [progress, completed, id, student_id]);
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
