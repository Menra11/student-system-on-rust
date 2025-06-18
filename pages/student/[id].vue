<template>
  <div class="min-h-screen bg-blue-50">
    <Header />
    
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- 导航卡片 -->
      <div class="bg-white rounded-2xl shadow-blue overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6">
          <h2 class="text-xl font-bold text-white">学生导航</h2>
        </div>
        
        <nav class="p-6 flex flex-wrap gap-4">
          <NuxtLink
            :to="`/student/${userStore.user.id}`"
            class="px-5 py-3 border border-gray-200 rounded-lg transition-all duration-300  flex items-center font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300"
            active-class="bg-blue-100 border-blue-500 text-blue-700"
          >
            <i class="fas fa-user-circle mr-2"></i>
            学生详情
          </NuxtLink>
          
          <NuxtLink
            :to="`/student/${userStore.user.id}/sourseSelection`"
            class="px-5 py-3 border border-gray-200 rounded-lg transition-all duration-300  flex items-center font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300"
            active-class="bg-blue-100 border-blue-500 text-blue-700"
          >
            <i class="fas fa-book mr-2"></i>
            选课
          </NuxtLink>
          
          <NuxtLink
            :to="`/student/${userStore.user.id}/grades`"
            class="px-5 py-3 border border-gray-200 rounded-lg transition-all duration-300  flex items-center font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300"
            active-class="bg-blue-100 border-blue-500 text-blue-700"
          >
            <i class="fas fa-chart-bar mr-2"></i>
            成绩查询
          </NuxtLink>
          
          <NuxtLink
            to="/"
            class="px-5 py-3 border border-gray-200 rounded-lg transition-all duration-300  flex items-center font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 ml-auto"
          >
            <i class="fas fa-sign-out-alt mr-2"></i>
            退出登录
          </NuxtLink>
        </nav>
      </div>
      
      <!-- 内容区域卡片 -->
      <div class="bg-white rounded-2xl shadow-blue overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6">
          <h2 class="text-xl font-bold text-white">内容区域</h2>
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
</script>

<style scoped>

.shadow-blue {
  box-shadow: 0 4px 6px -1px rgba(30, 64, 175, 0.2), 0 2px 4px -1px rgba(30, 64, 175, 0.06);
}

</style>