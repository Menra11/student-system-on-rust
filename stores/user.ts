import { defineStore } from "pinia";
import type { StudentRes, ScoreRes } from "~/types/student";
import type { TeacherResponse } from "~/types/teacher";
import type { AdminResponse } from "~/types/admin/admin";

export const useMyUserStore = defineStore("myUserStore", {
  state: () => ({
    user: {
      id: null,
      name: "",
      user_type: "",
      token: null,
      selectedCourses: [],
    },
  }),
  actions: {
    setToken(token: string) {
      this.user.token = token;
      if (import.meta.client) {
        localStorage.setItem("token", token);
      }
    },
    clearUser() {
      this.user.id = null;
      this.user.name = "";
      this.user.user_type = "";
      this.user.token = null;
      this.user.selectedCourses = [];
      if (import.meta.client) {
        localStorage.removeItem("token");
      }
    },
    async getUser(id: number, user: string) {
      if (user === "student") {
        // 获取学生数据

        const student_response = await $fetch<StudentRes>(
          `http://localhost:5800/api/student/${id}`,
          {
            method: "GET",
          }
        );

        // 获取学生成绩

        const score_response = await $fetch<ScoreRes>(
          `http://localhost:5800/api/student/${id}/scores`,
          {
            method: "GET",
          }
        );
        if (student_response.success) {
          this.user.name = student_response.student.student_name;
        }
        if (score_response.success) {
          this.user.selectedCourses = score_response.scores.map(
            (score) => score.course_name
          );
        }
      } else if (user === "teacher") {
        const response = await $fetch<TeacherResponse>(
          `http://localhost:5800/api/teacher/${id}`,
          {
            method: "GET",
          }
        );

        if (response.success) {
          this.user.name = response.teacher.teacher_name;
        }
      } else if (user === "admin") {
        const response = await $fetch<AdminResponse>(
          `http://localhost:5800/api/admin/${id}`,
          {
            method: "GET",
          }
        );
        if (response.success) {
          this.user.name = response.admin.admin_name;
        }
      }

      this.user.id = id;
      this.user.user_type = user;
    },

    flashCourses(courses: any) {
      this.user.selectedCourses.push(...courses);
    },
  },
  persist: true,
});
