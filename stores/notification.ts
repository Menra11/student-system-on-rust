import { defineStore } from "pinia";

export const useMyNotificationStore = defineStore("myNotificationStore", {
  state: () => ({
    notice: {
      show: false,
      message: "",
      type: "success" as "success" | "error",
    },
  }),
  actions: {
    // 设置通知
    setNotification({
      message,
      type,
    }: {
      message: string;
      type: "success" | "error";
    }) {
      this.notice = {
        show: true,
        message,
        type,
      };
    },
    // 显示通知
    showNotification() {
      setTimeout(() => {
        this.notice.show = false;
      }, 3000);
    },
  },
});
