import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const query = "SELECT teacher_id,teacher_name FROM teacher";
  const [rows] = await pool.query(query);
  console.log(1234);
  
  return rows
})
