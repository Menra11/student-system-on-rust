<template>
  <div>
    <div class="mb-6">
      <button
        @click="goBack"
        class="flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-2" />
        返回
      </button>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-xl font-semibold mb-4">基本信息</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-600">课程ID</label>
              <p class="mt-1">{{ course.course_id }}</p>
            </div>
            <div>
              <label class="block text-gray-600">课程名称</label>
              <p class="mt-1">{{ course.course_name }}</p>
            </div>
            <div>
              <label class="block text-gray-600">学分</label>
              <p class="mt-1">{{ course.credit }}</p>
            </div>
            <div>
              <label class="block text-gray-600">教授教师</label>
              <p class="mt-1">{{ course.teacher_name }}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-semibold mb-4">上课信息</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-600">上课教室</label>
              <p class="mt-1">{{ course.classroom }}</p>
            </div>
            <div>
              <label class="block text-gray-600">时间表</label>
              <p class="mt-1">{{ course.schedule }}</p>
            </div>
            <div>
              <label class="block text-gray-600">描述</label>
              <p class="mt-1">{{ course.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">课程视频列表</h2>
        <div class="overflow-x-auto rounded-lg shadow">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-blue-100" align="center" valign="middle">
              <tr>
                <th class="py-3 px-4 text-sm text-blue-700">视频ID</th>
                <th class="py-3 px-4 text-sm text-blue-700">视频标题</th>
                <th class="py-3 px-4 text-sm text-blue-700">视频描述</th>
                <th class="py-3 px-4 text-sm text-blue-700">视频时长</th>
                <th class="py-3 px-4 text-sm text-blue-700">视频名称</th>
              </tr>
            </thead>
            <tbody
              class="bg-white divide-y divide-gray-200"
              align="center"
              valign="middle"
            >
              <tr
                v-for="video in videos"
                :key="video.video_id"
                class="hover:bg-blue-50 transition-colors"
              >
                <td class="py-3 px-4">{{ video.video_id }}</td>
                <td class="py-3 px-4">{{ video.video_title }}</td>
                <td class="py-3 px-4">{{ video.video_description }}</td>
                <td class="py-3 px-4">
                  {{ formatTime(video.video_duration) }}
                </td>
                <td class="py-3 px-4">{{ video.video_url }}</td>
              </tr>
              <tr v-if="videos.length === 0">
                <td colspan="5" class="py-4 text-center text-gray-500">
                  暂无视频记录
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course, Video, CourseInfoResponse } from "~/types/admin/course";
const route = useRoute();
const router = useRouter();
definePageMeta({
  title: "课程信息",
});
const course = ref<Course>({
  course_id: 0,
  course_name: "",
  credit: 0,
  teacher_name: "",
  classroom: "",
  schedule: "",
  description: "",
});
const videos = ref<Video[]>([
  {
    video_id: 0,
    video_title: "",
    video_description: "",
    video_duration: 0,
    video_url: "",
  },
]);
const goBack = () => {
  router.go(-1);
};

// 格式化时间 (秒 -> 分:秒)
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// 获取课程信息
const fetchCourse = async () => {
  const { Course, Videos } = await $fetch<CourseInfoResponse>(
    `/api/admin/course/${route.params.courseInfo}`,
    {
      method: "GET",
    }
  );
  if (Course && Videos) {
    course.value = Course[0];
    videos.value = Videos;
  }
};
onMounted(() => {
  fetchCourse();
});
</script>

<style></style>
