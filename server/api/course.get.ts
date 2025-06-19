import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const query = "SELECT * FROM course";
  const [rows] = await pool.query(query);
  return rows
})
