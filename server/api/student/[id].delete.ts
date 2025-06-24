import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const student_id = event.context.params.id;
  console.log(student_id);

  // 删除学生
  await pool.query(`DELETE FROM student_video_progress WHERE student_id =  ${student_id};`);
  await pool.query(`DELETE FROM score WHERE student_id = ${student_id};`);
  await pool.query(`DELETE FROM student WHERE student_id =  ${student_id};`);
  return {
    success: true,
    message: "删除成功",
  };
});
