<template>
  <header
    class="bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-md"
  >
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <font-awesome-icon :icon="['fas', 'graduation-cap']" class="text-xl" />
        <h1 class="text-lg font-bold truncate max-w-[160px] sm:max-w-none">
          menra 学生管理系统
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <div
          class="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center"
        >
          <font-awesome-icon
            :icon="['fas', 'user-circle']"
            class="text-xl text-blue-100"
          />
        </div>

        <div class="flex flex-col min-w-0">
          <p class="font-medium text-sm truncate">{{ userStore.user.name }}</p>
          <div class="flex flex-wrap gap-1.5 mt-0.5">
            <span class="bg-blue-900 px-1.5 py-0.5 rounded-full text-xs">
              ID: {{ userStore.user.id }}
            </span>
            <span class="bg-blue-900 px-1.5 py-0.5 rounded-full text-xs">
              {{ formatUserType(userStore.user.user_type) }}
            </span>
          </div>
        </div>

        <NuxtLink
          to="/login"
          class="ml-2 px-3 py-1.5 text-sm border border-blue-500 rounded-md transition-all duration-300 flex items-center font-medium hover:bg-blue-600 hover:border-blue-300"
          @click="logout"
          title="退出登录"
        >
          <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="text-sm" />
        </NuxtLink>
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

const logout = () => {
  userStore.clearUser();
  navigateTo("/login");
};
</script>

<style scoped>
header {
  box-shadow: 0 2px 4px -1px rgba(30, 64, 175, 0.2),
    0 1px 2px -1px rgba(30, 64, 175, 0.06);
}
</style>
