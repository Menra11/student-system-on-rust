import pool from "@/server/api/db";

interface svRow {
  student_id: number;
  video_id: number;
}

export default defineEventHandler(async (event) => {
  const { student_id } = getQuery(event);
  const progressQuery = `SELECT v.video_id,v.video_title,v.video_description,v.video_url,v.video_duration,t.teacher_name,c.course_name,s.completed 
      FROM video v
      right join student_video_progress s on s.video_id = v.video_id 
      LEFT JOIN course c ON v.course_id = c.course_id
      left join teacher t on c.teacher_id = t.teacher_id
      where s.student_id = ?;`;

  const potentialVideosQuery = `SELECT s.student_id,v.video_id
      FROM score s
      left join video v on v.course_id = s.course_id
      where s.student_id = ?;`;

  const [existingRows] = await pool.query(progressQuery, [student_id]);
  const [potentialVideos] = await pool.query<any[]>(potentialVideosQuery, [student_id]);

  const existingVideoIds = (existingRows as svRow[]).map((row: svRow) => row.video_id);
  const missingVideos = (potentialVideos as svRow[]).filter(
    (video: any) => !existingVideoIds.includes(video.video_id)
  );

  if (missingVideos.length > 0) {
    const insertValues = missingVideos.map((video: any) => [
      student_id,
      video.video_id,
      0,
      0,
    ]);
    const insertQuery = `INSERT INTO student_video_progress (student_id,video_id,progress,completed) VALUES ?;`;

    await pool.query(insertQuery, [insertValues]);
  }
  const [updatedRows] = await pool.query(progressQuery, [student_id]);
  return updatedRows;
});
