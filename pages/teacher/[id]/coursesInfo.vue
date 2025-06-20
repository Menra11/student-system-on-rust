<template>
  <div>
    <!-- 视频列表区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 视频卡片1 -->
      <div
        v-for="course in courseData"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      >
        <div class="p-4">
          <h3 class="font-bold text-lg mb-1">{{course.course_name}}</h3>
          <p class="text-gray-600 text-sm mb-2">{{ course.credit }} 学分</p>
          <p class="text-gray-700 mb-3">
            {{course.description}}
          </p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-blue-600 font-medium">{{course.schedule}}</span>
            <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">查看视频数据</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMyUserStore } from "@/stores/user";
import type { Course } from "@/types/teacher/course";
const route = useRoute();
definePageMeta({
  title: "教授课程信息", // 设置页面标题
});

const userStore = useMyUserStore();
const courseData = ref<Course[]>([
  {
    course_name: "数据结构",
    credit: 2,
    classroom: "教室101",
    schedule: "周一1-2节",
    description: "计算机专业基础课程",
  },
]);
onMounted(async () => {
  const {CoursesInformation} = await $fetch<Course[]>(`/api/teacher/${route.params.id}/coursesInfo`,{
    method: "GET",
  });

  courseData.value = CoursesInformation;
});
</script>
