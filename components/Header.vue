<template>
  <header
    class="bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg"
  >
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <font-awesome-icon :icon="['fas', 'graduation-cap']" class="text-2xl" />
        <h1 class="text-xl font-bold">menra 学生管理系统</h1>
      </div>

      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
            <font-awesome-icon :icon="['fas', 'user-circle']" class="text-2xl text-blue-100" />
          </div>
        <div>
          <p class="font-medium">{{ userStore.user.name }}</p>
          <div class="flex items-center text-sm text-blue-100">
            <span class="bg-blue-900 px-2 py-0.5 rounded-full mr-2">
              ID: {{ userStore.user.id }}
            </span>
            <span class="bg-blue-900 px-2 py-0.5 rounded-full">
              {{ formatUserType(userStore.user.user_type) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useMyUserStore } from "@/stores/user";
const userStore = useMyUserStore();

const formatUserType = (type: string) => {
  switch (type) {
    case "student":
      return "学生";
    case "teacher":
      return "教师";
    case "admin":
      return "管理员";
    default:
      return type;
  }
};
</script>

<style scoped>
header {
  box-shadow: 0 4px 6px -1px rgba(30, 64, 175, 0.2),
    0 2px 4px -1px rgba(30, 64, 175, 0.06);
}
</style>
