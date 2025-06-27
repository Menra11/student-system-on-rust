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
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>