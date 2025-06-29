import pool from "@/server/api/db";
import jwt from "jsonwebtoken";
import type { LoginDataRequest, loginData } from "@/types/login";
// 从环境变量获取密钥，确保在生产环境设置
const JWT_SECRET = "your-very-secure-secret-key";
const JWT_EXPIRES_IN = "1d";

export default defineEventHandler(async (event) => {
  try {
    const { user_from } = await readBody<LoginDataRequest>(event);
    const { user_id, password, user } = user_from;
    console.log(user_from);

    let query = "";
    let userData: any;

    if (user === "student") {
      query = `SELECT * FROM Student WHERE student_id = ?`;
    } else if (user === "teacher") {
      query = `SELECT * FROM Teacher WHERE teacher_id = ?`;
    } else if (user === "admin") {
      query = `SELECT * FROM Admin WHERE admin_id = ?`;
    }

    const [rows] = await pool.query(query, [user_id]);

    if (Array.isArray(rows) && rows.length === 0) {
      return {
        success: false,
        message: "用户不存在，请重试",
        ErrorCodes: "USER_NOT_FOUND",
      };
    }

    userData = rows[0];

    if (userData.password !== password) {
      return {
        success: false,
        message: "密码错误，请重试",
        errorCode: "INVALID_CREDENTIALS",
      };
    }

    const payload = {
      id: user_id,
      type: user,
      name: userData.name || "",
      email: userData.email || "",
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      success: true,
      message: "登录成功",
      token: token,
    };
  } catch (error) {
    console.error("登录失败：", error);
    return {
      success: false,
      message: "登录失败",
    };
  }
});
