import { defineStore } from "pinia";
import type { Student, Score, StudentGet } from "~/types/student";
import type { TeacherGet } from "~/types/teacher";

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
    clearToken() {
      this.user.token = null;
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
        this.user.selectedCourses = Scores;
        
      } else if (user === "teacher") {
        const { Teacher } = await $fetch<TeacherGet>(
          `/api/teacher/${id}`,
          {
            method: "GET",
          }
        );
        this.user.name = Teacher[0].teacher_name;
      } else if (user === "admin") {
        
      }

      this.user.id = id;
      this.user.user_type = user;
    },
  },
  persist: true,
});
