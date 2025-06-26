import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const course_id = event.context.params.courseInfo;
  const query = `SELECT c.course_id,c.course_name,c.credit,t.teacher_name,c.classroom,c.schedule,c.description 
      FROM Course c
      left join Teacher t on c.teacher_id = t.teacher_id
      where c.course_id = ?;
`;
  const [Course] = await pool.query(query, [course_id]);
  const videoQuery = `SELECT v.video_id,v.video_title,v.video_description,v.video_duration,v.video_url
      FROM Video v
      where v.course_id = ?;
`;
  const [Videos] = await pool.query(videoQuery, [course_id]);
  return {
    Course: Course,
    Videos: Videos,
  };
});
