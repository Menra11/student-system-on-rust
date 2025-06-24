import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  try {
    // 获取学生数据
    const [students] = await pool.query(`
      SELECT s.student_id,s.student_name,s.gender,s.birth_date,s.class_id,s.phone,s.email, c.class_name 
      FROM Student s
      LEFT JOIN Class c ON s.class_id = c.class_id
    `);

    return {
      Students: students,
    };
  } catch (error) {
    console.error("获取学生数据失败：", error);
    return createError({
      statusCode: 500,
      statusMessage: "获取学生数据失败",
      data: {
        message: "无法获取学生数据，请稍后再试",
      },
    });
  }
});
