import { defineStore } from "pinia";

export const useMyNotificationStore = defineStore("myNotificationStore", {
  state: () => ({
    notice: {
      show: false,
      message: "",
      type: 'success' as 'success' | 'error',
    },
  }),
  actions: {
    // 显示通知
    showNotification(message: string, type: 'success' | 'error' = 'success') {
      this.notice = {
        show: true,
        message,
        type: type as 'success' | 'error',
      };
      setTimeout(() => {
        this.notice.show = false;
      }, 3000);
    },
  },
});