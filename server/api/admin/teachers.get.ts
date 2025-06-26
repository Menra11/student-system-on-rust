import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const query = "SELECT teacher_id,teacher_name,gender,birth_date,title,phone,email FROM teacher";
  const [teachers] = await pool.query(query);
  return {
    Teachers:teachers
  }
})
