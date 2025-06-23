import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const admin_id = event.context.params.id;
  const query = "SELECT admin_id,admin_name FROM admin WHERE admin_id = ?";
  const [rows] = await pool.query(query,[admin_id]);
  return {Admin:rows[0]}
})
