import pool from "@/server/api/db";
import type { CourseResponse } from "@/types/course";
export default defineEventHandler(async (event) => {
  try {
    const { studentId, courses } = getQuery<CourseResponse>(event);
    console.log("studentId:", studentId, "courses:", courses);

    // 验证输入
    if (!studentId || !courses) {
      return {
        success: false,
        message: "选课失败",
      };
    }
    if (Array.isArray(courses)) {
      for (const courseId of courses) {
        await pool.query(
          "INSERT INTO score (student_id, course_id,semester) VALUES (?, ?,'2024-2025-1')",
          [studentId, courseId]
        );
      }
    } else {
      await pool.query(
        "INSERT INTO score (student_id, course_id,semester) VALUES (?, ?,'2024-2025-1')",
        [studentId, courses]
      );
    }

    return {
      success: true,
      message: "选课成功",
      selectedCount: courses.length,
    };
  } catch (error) {
    console.error("选课失败:", error);
    return {
      success: false,
      message: "选课失败",
    };
  }
});
