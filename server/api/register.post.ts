import pool from "@/server/api/db";
import type { registerData } from "@/types/register";
export default defineEventHandler(async (event) => {
  try {
    const registerData = getQuery<registerData>(event);
    let getclass_id_query = `SELECT class_id FROM Class WHERE class_name = ?;`;
    let query = `INSERT INTO Student (student_id, student_name, gender, birth_date, class_id, phone, email,password) VALUES
(?, ?, ?, ?, ?, ?, ?, ?);`;
    console.log(registerData,registerData.class_name);
    
    const [class_id_rows] = await pool.query(getclass_id_query,[registerData.class_name]);
    console.log(class_id_rows[0].class_id);

    const [rows] = await pool.query(query,[registerData.student_id, registerData.student_name, registerData.gender, registerData.birth_date, class_id_rows[0].class_id, registerData.phone, registerData.email, registerData.password]);
    console.log(rows[0]);

  } catch (error) {
    console.error("登录失败：", error);
    return createError({
      statusCode: 500,
      statusMessage: "登录失败",
      data: {
        message: "登录失败，请稍后再试",
      },
    });
  }
});
