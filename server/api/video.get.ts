import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const query = `SELECT v.video_id,v.video_title,v.video_description,v.video_url,v.video_duration,t.teacher_name,c.course_name 
      FROM video v
      LEFT JOIN course c ON v.course_id = c.course_id
      left join teacher t on c.teacher_id = t.teacher_id;`;
  const [rows] = await pool.query(query);
  return rows;
});
