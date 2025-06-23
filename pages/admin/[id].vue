<template>
  <div class="min-h-screen bg-blue-50">
    <Header />

    <div class="container mx-auto px-4 py-8 max-w-5xl">
      <!-- 导航卡片 -->
      <div class="bg-white rounded-2xl shadow-blue overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6">
          <h2 class="text-xl font-bold text-white">学生导航</h2>
        </div>

        <nav class="p-6 flex flex-wrap gap-4">
          <NuxtLink
            :to="`/admin/${userStore.user.id}`"
            class="px-5 py-3 border border-gray-200 shadow-blue rounded-lg transition-all duration-300 flex items-center font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 focus:bg-blue-100 focus:border-blue-500 focus:text-blue-700"
          >
            <font-awesome-icon :icon="['fas', 'user-circle']" class="mr-2" />
            管理员信息
          </NuxtLink>
          <NuxtLink
            :to="`/admin/${userStore.user.id}/students`"
            class="px-5 py-3 border border-gray-200 shadow-blue rounded-lg transition-all duration-300 flex items-center font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 focus:bg-blue-100 focus:border-blue-500 focus:text-blue-700"
          >
            <font-awesome-icon :icon="['fas', 'user-circle']" class="mr-2" />
            学生管理
          </NuxtLink>
          <NuxtLink
            :to="`/admin/${userStore.user.id}/students`"
            class="px-5 py-3 border border-gray-200 shadow-blue rounded-lg transition-all duration-300 flex items-center font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 focus:bg-blue-100 focus:border-blue-500 focus:text-blue-700"
          >
            <font-awesome-icon :icon="['fas', 'user-circle']" class="mr-2" />
            教师管理
          </NuxtLink>   
          <NuxtLink
            :to="`/admin/${userStore.user.id}/students`"
            class="px-5 py-3 border border-gray-200 shadow-blue rounded-lg transition-all duration-300 flex items-center font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 focus:bg-blue-100 focus:border-blue-500 focus:text-blue-700"
          >
            <font-awesome-icon :icon="['fas', 'user-circle']" class="mr-2" />
            课程管理
          </NuxtLink>
          <NuxtLink
            :to="`/admin/${userStore.user.id}/students`"
            class="px-5 py-3 border border-gray-200 shadow-blue rounded-lg transition-all duration-300 flex items-center font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 focus:bg-blue-100 focus:border-blue-500 focus:text-blue-700"
          >
            <font-awesome-icon :icon="['fas', 'user-circle']" class="mr-2" />
            视频管理
          </NuxtLink>

          <NuxtLink
            to="/login"
            class="px-5 py-3 border border-gray-200 rounded-lg transition-all duration-300 flex items-center font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 ml-auto"
            @click="logout"
          >
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="mr-2" />
            退出登录
          </NuxtLink>
        </nav>
      </div>

      <!-- 内容区域卡片 -->
      <div class="bg-white rounded-2xl shadow-blue overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6">
          <h2 class="text-xl font-bold text-white">
            {{ $route.meta.title || "内容区域" }}
          </h2>
        </div>

        <div class="p-6">
          <NuxtPage />
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="mt-8 text-center text-blue-800 text-sm">
        <p>© 2025 menra 学生管理系统</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import { useMyUserStore } from "@/stores/user";
const userStore = useMyUserStore();

const logout = () => {
  userStore.clearUser();
  navigateTo("/login");
};
</script>

<style scoped>
.shadow-blue {
  box-shadow: 0 4px 6px -1px rgba(30, 64, 175, 0.2),
    0 2px 4px -1px rgba(30, 64, 175, 0.06);
}

/* 导航链接悬停效果 */
nav a:hover {
  transform: translateY(-2px);
}

/* 活动链接样式增强 */
.router-link-active {
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2),
    0 2px 4px -1px rgba(59, 130, 246, 0.1);
}
</style>
