import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const query = `select st.student_id,st.student_name,c.course_name,cl.class_name
from teacher t
left join course c on c.teacher_id = t.teacher_id 
left join score s on s.course_id = c.course_id
left join student st on st.student_id = s.student_id
left join class cl on cl.class_id = st.class_id
where t.teacher_id = ?;`
const [StudentsInformation] = await pool.query(query, [id])
return {
  StudentsInformation:StudentsInformation
}
})
