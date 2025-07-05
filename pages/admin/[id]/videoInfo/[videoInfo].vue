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
      <h2 class="text-xl font-semibold mb-4">基本信息</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-gray-600">视频ID</label>
            <p class="mt-1">{{ video.video_id }}</p>
          </div>

          <div>
            <label class="block text-gray-600">视频标题</label>
            <p class="mt-1">{{ video.video_title }}</p>
          </div>

          <div>
            <label class="block text-gray-600">所属课程</label>
            <p class="mt-1">{{ video.course_name }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-gray-600">视频时长</label>
            <p class="mt-1">{{ formatTime(video.video_duration) }}</p>
          </div>

          <div>
            <label class="block text-gray-600">视频描述</label>
            <p class="mt-1">{{ video.video_description }}</p>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">课程视频</h2>
        <div class="relative">
          <video
            ref="videoPlayer"
            :src="videoSource"
            controls
            class="w-full rounded-lg bg-black"
          ></video>

          <!-- 视频加载指示器 -->
          <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
          >
            <div class="animate-spin text-white text-4xl">
              <font-awesome-icon :icon="['fas', 'spinner']" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video, VideoResponse, VideosResponse } from "~/types/video";
const route = useRoute();
const router = useRouter();
definePageMeta({
  title: "视频信息",
});
const video = ref<Video>({
  video_id: null,
  video_title: "",
  video_description: "",
  video_url: "",
  video_duration: null,
  course_name: "",
});
const videoSource = ref("");
const isLoading = ref(true);
// 加载视频
const loadVideo = () => {
  isLoading.value = true;

  // 模拟视频加载延迟
  setTimeout(() => {
    videoSource.value = `/_nuxt/assets/videos/${video.value.video_url}`;
    console.log(video.value.video_url);
    
    isLoading.value = false;
  }, 800);
};
watch(
  () => route.params.videoInfo,
  (newVideoId) => {
    if (newVideoId) {
      loadVideo();
    }
  },
  { immediate: true }
);

const goBack = () => {
  router.go(-1);
};
// 格式化时间 (秒 -> 分:秒)
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// 获取视频信息
const fetchVideo = async () => {
  const response = await $fetch<VideoResponse>(
    `http://localhost:5800/api/video/${route.params.videoInfo}`,
    {
      method: "GET",
    }
  );
  if (response.success) {
    video.value = response.video;
  }
};
onMounted(() => {
  fetchVideo();
});
</script>

<style></style>
