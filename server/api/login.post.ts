import pool from "./db";

export default defineEventHandler(async (event) => {
  try {
    const { user_id, password, user } = getQuery(event);
    let query = '';
    if (user == "student") {
      query = `SELECT password FROM Student WHERE student_id = ?`
    }
    if (user == "teacher") {
      query = `SELECT password FROM Teacher WHERE teacher_id = ?`
    }
    if (user == "admin") {
      query = `SELECT password FROM Admin WHERE admin_id = ?`
    }
    const [rows] = await pool.query(
        query,
        [user_id]
      );
    if (Array.isArray(rows) && rows.length === 0) {
      return {
        success: false,
        message: "用户不存在，请重试",
        ErrorCodes: "USER_NOT_FOUND",
      };
    }

    const storedpassword = rows[0].password;
    if (storedpassword === password) {
      return {
        success: true,
        message: "登录成功",
      };
    } else {
      return {
        success: false,
        message: "密码错误，请重试",
        ErrorCodes: "INVALID_CREDENTIALS",
      };
    }
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
