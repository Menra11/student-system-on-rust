import pool from "@/server/api/db";
export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const query = `select sp.student_id,s.student_name,c.course_name,v.video_title,v.video_duration,sp.progress,sp.completed,sc.score
from teacher t
left join course c on c.teacher_id = t.teacher_id 
left join video v on v.course_id = c.course_id
left join student_video_progress sp on sp.video_id = v.video_id
left join student s on s.student_id = sp.student_id
left join score sc on sc.course_id = c.course_id and sc.student_id = sp.student_id
where t.teacher_id = ?;
`
const [VideoInfo] = await pool.query(query, [id])
console.log(VideoInfo);

return {
  VideoInfo:VideoInfo
}
})
