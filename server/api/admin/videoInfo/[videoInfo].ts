import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const video_id = event.context.params.videoInfo;
  // 获取视频基本信息
  const [video] = await pool.query(
    `SELECT v.video_id,v.video_title,v.video_description,v.video_url,v.video_duration,c.course_name 
        FROM video v
        left join course c on v.course_id = c.course_id
        where v.video_id = ?;
    `,
    [video_id]
  );

  if (!video) {
    return {
      success: false,
      message: "获取视频失败",
    };
  }
  return {
    Video: video,
  };
});
