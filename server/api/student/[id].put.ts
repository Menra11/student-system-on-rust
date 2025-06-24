import { Body } from "#components";
import pool from "@/server/api/db";
import type { StudentResponse } from "@/types/student";

export default defineEventHandler(async (event) => {
  // const student_id = event.context.params.id;
  const {Student} = await readBody<StudentResponse>(event);
  const {student_id,gender,birth_date,class_id,phone,email } = Student; 
  console.log(Student);
  console.log(student_id,gender,birth_date,class_id,phone,email);

  const [student] = await pool.query(
    `UPDATE student s
SET 
    s.student_name = ?,
    s.gender = ?,
    s.birth_date = ?,
    s.class_id = ?,
    s.phone = ?,
    s.email = ?
WHERE student_id = ?; 
`,
    [
      Student.student_name,
      Student.gender,
      Student.birth_date,
      Student.class_id,
      Student.phone,
      Student.email,
      student_id,
    ]
  );

  return {
      success: true,
      message: "更改成功",
    };
});
