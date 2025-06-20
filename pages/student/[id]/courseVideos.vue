<template>
  <div>
    <!-- 视频筛选/搜索区域 -->
    <div class="bg-blue-50 rounded-xl p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >课程筛选</label
          >
          <select
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>全部课程</option>
            <option>高等数学</option>
            <option>大学英语</option>
            <option>计算机基础</option>
          </select>
        </div>

        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >讲师筛选</label
          >
          <select
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>全部讲师</option>
            <option>张教授</option>
            <option>李老师</option>
            <option>王教授</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            筛选
          </button>
        </div>
      </div>
    </div>

    <!-- 视频列表区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 视频卡片1 -->
      <div
        v-for="video in videoData"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        @click="() => $router.push(`/student/${userStore.user.id}/courseVideo/${video.video_id}`)"
      >
        <div class="p-4">
          <h3 class="font-bold text-lg mb-1">{{video.course_name}} - {{ video.video_title }}</h3>
          <p class="text-gray-600 text-sm mb-2">{{ video.teacher_name }}</p>
          <p class="text-gray-700 mb-3">
            {{video.video_description}}
          </p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-blue-600 font-medium">{{formatTime(video.video_duration)}}</span>
            <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded" v-if="video.completed">已观看</span>
            <span class="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded" v-else>未观看</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMyUserStore } from "@/stores/user";
import type { Video } from "@/types/video";
definePageMeta({
  title: "课程视频", // 设置页面标题
});

const userStore = useMyUserStore();
const videoData = ref<Video[]>([
  {
    video_id: 1,
    video_title: "导数和微分",
    video_description: "本课程讲解导数的基本概念和微分应用...",
    video_url: "1.mp4",
    video_duration: 45,
    teacher_name: "张教授",
    course_name: "高等数学",
    completed: true,
  },
]);
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};
onMounted(async () => {
  const res = await $fetch<Video[]>("/api/video");

  videoData.value = res;
  videoData.value = videoData.value.filter(
    (course) =>
      userStore.user.selectedCourses.some(
        (selectedCourse) => selectedCourse.course_name === course.course_name
      )
  );
});
</script>
