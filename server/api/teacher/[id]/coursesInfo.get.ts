import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const id = event.context.params.id

  const query = `select c.course_id,c.course_name,c.credit,c.classroom,c.schedule,c.description
from teacher t
left join course c on c.teacher_id = t.teacher_id
where t.teacher_id = ?;
`
const [Courses] = await pool.query(query, [id])

return {
  Courses:Courses
}
})
