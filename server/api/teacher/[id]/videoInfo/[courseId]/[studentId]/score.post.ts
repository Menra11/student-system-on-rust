import pool from "@/server/api/db"
export default defineEventHandler(async (event) => {
  const student_id = event.context.params.studentId
  const course_id = event.context.params.courseId
  const {score} = await readBody(event);
  
  await pool.query(
    'UPDATE score SET score = ? WHERE student_id = ? AND course_id = ?',
    [score, student_id, course_id]
  )
  return {
    success: true,
    message: "成绩添加成功"
  }
})
