import { defineStore } from "pinia";
import type { StudentGet } from "~/types/student";
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
        const { Student, Scores } = await $fetch<StudentGet>(
          `/api/student/${id}`,
          {
            method: "GET",
          }
        );
        
        this.user.name = Student[0].student_name;
        this.user.selectedCourses = Scores.map(score => score.course_name);
        
      } else if (user === "teacher") {
        const { Teacher } = await $fetch<TeacherResponse>(
          `/api/teacher/${id}`,
          {
            method: "GET",
          }
        );
        this.user.name = Teacher[0].teacher_name;
      } else if (user === "admin") {
        const { Admin } = await $fetch<AdminResponse>(
          `/api/admin/${id}`,
          {
            method: "GET",
          }
        );
        this.user.name = Admin.admin_name;
      }

      this.user.id = id;
      this.user.user_type = user;
    },

    flashCourses(courses: any) {
      this.user.selectedCourses.push(...courses);
    }
  },
  persist: true,
});
