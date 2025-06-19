import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const query = `SELECT v.video_id,v.video_title,v.video_description,v.video_url,v.video_duration,v.video_lecturer,c.course_name 
      FROM video v
      LEFT JOIN course c ON v.course_id = c.course_id`;
  const [rows] = await pool.query(query);
  return rows;
});
