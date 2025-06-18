import { defineStore } from "pinia";
import type { Student, Score, StudentGet } from "~/types/student";

export const useMyUserStore = defineStore("myUserStore", {
  state: () => ({
    user: {
      id: 0,
      name: "",
      user_type: "",
    },
  }),
  actions: {
    async getStudentUser(id: number) {
      const { Student } = await $fetch<StudentGet>(`/api/student/${id}`, {
        method: "GET",
      });
      this.user.id = id;
      this.user.name = Student[0].student_name;
      this.user.user_type = "student";
    },
  },
});
