import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  try {
    // 获取班级数据
    const [classes] = await pool.query(`
      SELECT c.class_id, c.class_name 
      FROM class c;
    `);
    return {
      Classes: classes,
    };
  } catch (error) {
    console.error("获取班级数据失败：", error);
    return createError({
      statusCode: 500,
      statusMessage: "获取班级数据失败",
      data: {
        message: "无法获取班级数据，请稍后再试",
      },
    });
  }
});
