import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  try {
    const student_id = event.context.params.id;
    const video_id  = event.context.params.videoId;
    console.log(video_id,student_id);
    // 获取视频基本信息
    const [video] = await pool.query(`
      SELECT v.video_id,v.video_title,v.video_description,v.video_url,v.video_duration,t.teacher_name,c.course_name 
      FROM video v
      LEFT JOIN course c ON v.course_id = c.course_id
      left join teacher t on c.teacher_id = t.teacher_id
      where v.video_id = ?;
    `, [video_id])
    
    if (!video) {
      return {
        success: false,
        message: "获取视频失败",
      };
    }
    
    // 获取视频阅读记录
    let progress:any;
    progress = await pool.query(`
      SELECT *
      FROM student_video_progress sp
      WHERE sp.student_id = ? AND sp.video_id = ?;
    `, [student_id, video_id])
    
    if(!progress){
      await pool.query(`
        INSERT INTO student_video_progress (student_id, video_id,progress,completed)
        VALUES (?, ?,0,0);
      `, [student_id, video_id])
      progress = await pool.query(`
      SELECT *
      FROM student_video_progress sp
      WHERE sp.student_id = ? AND sp.video_id = ?;
    `, [student_id, video_id])
    }
    console.log(video);
    
    return {
      video: video,
      progress: progress[0]
    }
  } catch (error) {
    return {
        success: false,
        message: "视频访问失败",
      };
  }
})