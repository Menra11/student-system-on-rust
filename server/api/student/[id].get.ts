import pool from "@/server/api/db";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    
    // 获取学生基本信息
    const [student] = await pool.query(`
      SELECT s.student_id,s.student_name,s.gender,s.birth_date,s.phone,s.email,s.class_id, c.class_name 
      FROM Student s
      LEFT JOIN Class c ON s.class_id = c.class_id
      WHERE s.student_id = ?
    `, [id])
    
    if (!student) {
      return createError({
        statusCode: 404,
        statusMessage: '学生不存在'
      })
    }
    
    // 获取学生成绩
    const [scores] = await pool.query(`
      SELECT sc.score_id, c.course_name, c.credit, t.teacher_name, sc.score, sc.semester
      FROM Score sc
      JOIN Course c ON sc.course_id = c.course_id
      JOIN Teacher t ON c.teacher_id = t.teacher_id
      WHERE sc.student_id = ?
      ORDER BY sc.semester DESC
    `, [id])
    return {
      Student: student,
      Scores: scores || []
    }
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: '获取学生详情失败'
    })
  }
})