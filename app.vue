<template>
  <div>
    <NuxtPage />
    <Notice :notice-data="notice" />
  </div>
</template>

<script setup lang="ts" >
import Notice from "@/components/Notice.vue";
import { useMyUserStore } from "@/stores/user";
const userStore = useMyUserStore();
const notice = ref<{
  show: boolean;
  message: string;
  type: string;
}>({
  show: false,
  message: "",
  type: "",
});
// 显示通知
const showNotification = (
  message: string,
  type: "success" | "error" = "success"
) => {
  notice.value = {
    show: true,
    message,
    type,
  };
  setTimeout(() => {
    notice.value.show = false;
  }, 3000);
};

//获取到token时发出通知
watch(
  () => userStore.user.token,
  (token) => {
    if (token) {
      showNotification("登录成功",'success');
    }
  }
); 
</script>