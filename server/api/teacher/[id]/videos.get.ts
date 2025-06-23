import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const {course_id} = getQuery(event);
  
  const query = `select *
from video v
where v.course_id=?;
`
  const [Videos] = await pool.query(query, [course_id]);
  return {
    Videos: Videos
  }
})
