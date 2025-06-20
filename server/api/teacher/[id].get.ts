import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const query =  `SELECT teacher_id,teacher_name,gender,title,birth_date,phone,email 
  FROM teacher 
  where teacher_id = ?;`;
  const [teacher] = await pool.query(query,[id]);
  return {
    Teacher: teacher
  }
})
