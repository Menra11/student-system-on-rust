import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const query = `SELECT v.video_id,v.video_title,v.video_description,v.video_url,v.video_duration,c.course_name 
  FROM video v
  left join course c on v.course_id = c.course_id
  `;
  const [Videos] = await pool.query(query);
  return {
    Videos:Videos
  }
})
