import { defineStore } from "pinia";
import type { Student, Score, StudentGet } from "~/types/student";

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
    async getStudentUser(id: number) {
      const { Student,Scores } = await $fetch<StudentGet>(`/api/student/${id}`, {
        method: "GET",
      });
      this.user.id = id;
      this.user.name = Student[0].student_name;
      this.user.user_type = "student";
      this.user.token = localStorage.getItem("token");
      this.user.selectedCourses = Scores;
    },
  },
  persist: true,
});
