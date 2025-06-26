<template>
  <div>
    <NuxtPage />
    <Notice :notice-data="notificationStore.notice" />
  </div>
</template>

<script setup lang="ts" >
import Notice from "@/components/Notice.vue";
import { useMyNotificationStore } from "@/stores/notification";
const notificationStore = useMyNotificationStore();

watch(
  () => notificationStore.notice.show,
  (notice) => {
    if (notice) {
      notificationStore.showNotification();
    }
  }
); 
</script>

<!-- 
明日任务：
给学生添加课程时加上班级一起添加
给教师加上给成绩任务
教师的删除页面添加
管理员剩下页面添加
-->