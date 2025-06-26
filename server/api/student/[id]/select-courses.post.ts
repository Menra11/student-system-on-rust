import pool from "@/server/api/db";
import type { CourseResponse } from "@/types/course";
export default defineEventHandler(async (event) => {
  try {
    const student_id = event.context.params?.id;
    const { courses } = getQuery<CourseResponse>(event);
    // 验证输入
    if (!student_id || !courses) {
      return {
        success: false,
        message: "选课失败",
      };
    }
    if (Array.isArray(courses)) {
      for (const courseId of courses) {
        const [video_id] = await pool.query(
          "SELECT video_id FROM video WHERE course_id = ?",
          [courseId]
        );
        await pool.query(
          "INSERT INTO score (student_id, course_id,semester) VALUES (?, ?,'2024-2025-1')",
          [student_id, courseId]
        );
        await pool.query(
          "INSERT INTO student_video_progress (student_id, video_id,progress,completed) VALUES (?, ?,0,0);",
          [student_id, video_id[0].video_id]
        );
      }
    } else {
      const [video_id] = await pool.query(
        "SELECT video_id FROM video WHERE course_id = ?",
        [courses]
      );
      await pool.query(
        "INSERT INTO score (student_id, course_id,semester) VALUES (?, ?,'2024-2025-1')",
        [student_id, courses]
      );
      await pool.query(
        "INSERT INTO student_video_progress (student_id, video_id,progress,completed) VALUES (?, ?,0,0);",
        [student_id, video_id[0].video_id]
      );
    }
    return {
      success: true,
      message: "选课成功",
    };
  } catch (error) {
    console.error("选课失败:", error);
    return {
      success: false,
      message: "选课失败",
    };
  }
});
