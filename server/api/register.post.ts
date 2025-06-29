import pool from "@/server/api/db";
import type { RegisterRequest } from "@/types/register";
export default defineEventHandler(async (event) => {
  try {
    const { user_from } = await readBody<RegisterRequest>(event);
    let query = `INSERT INTO Student (student_id, student_name, gender, birth_date, class_id, phone, email,password) VALUES
(?, ?, ?, ?, ?, ?, ?, ?);`;
    console.log(user_from, user_from.class_id);

    const [rows] = await pool.query(query, [
      user_from.student_id,
      user_from.student_name,
      user_from.gender,
      user_from.birth_date,
      user_from.class_id,
      user_from.phone,
      user_from.email,
      user_from.password,
    ]);
    console.log(rows[0]);
    return {
      success: true,
      message: "注册成功",
    };
  } catch (error) {
    console.error("注册失败：", error);
    return {
      success: false,
      message: "注册失败",
    };
  }
});
