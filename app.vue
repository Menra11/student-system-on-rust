<template>
  <div>
    <NuxtPage />
    <Notice :notice-data="notificationStore.notice" />
  </div>
</template>

<script setup lang="ts" >
import Notice from "@/components/Notice.vue";
import { useMyUserStore } from "@/stores/user";
import { useMyNotificationStore } from "@/stores/notification";
const userStore = useMyUserStore();
const notificationStore = useMyNotificationStore();

watch(
  () => userStore.user.token,
  (token) => {
    if (token) {
      notificationStore.showNotification("登录成功",'success');
    }
  }
); 
</script>