<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- 返回按钮 -->
    <div class="mb-6">
      <button
        @click="goBack"
        class="flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-2" />
        返回课程列表
      </button>
    </div>

    <!-- 视频播放区域 -->
    <div class="bg-white rounded-2xl shadow-blue overflow-hidden mb-8">
      <div class="p-6">
        <div class="relative">
          <video
            ref="videoPlayer"
            :src="videoSource"
            controls
            class="w-full rounded-lg bg-black"
            @play="startTimer"
            @pause="pauseTimer"
            @ended="videoEnded"
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

        <!-- 视频信息卡片 -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-blue-800 mb-1">观看进度</h3>
            <div class="flex items-center">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  class="bg-blue-600 h-2.5 rounded-full"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
              <span class="ml-2 text-sm text-gray-700"
                >{{ progressPercentage }}%</span
              >
            </div>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-blue-800 mb-1">已观看时间</h3>
            <div class="flex items-center">
              <font-awesome-icon
                :icon="['fas', 'clock']"
                class="text-blue-600 mr-2"
              />
              <span class="text-lg font-medium">{{
                formatTime(watchedTime)
              }}</span>
            </div>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-blue-800 mb-1">视频时长</h3>
            <div class="flex items-center">
              <font-awesome-icon
                :icon="['fas', 'hourglass']"
                class="text-blue-600 mr-2"
              />
              <span class="text-lg font-medium">{{
                formatTime(videoData.video_duration)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程信息 -->
    <div class="bg-white rounded-2xl shadow-blue overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6">
        <h2 class="text-xl font-bold text-white">
          <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-2" />
          课程信息
        </h2>
      </div>

      <div class="p-6">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-shrink-0">
            <div
              class="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center"
            >
              <font-awesome-icon
                :icon="['fas', 'book']"
                class="text-3xl text-gray-400"
              />
            </div>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">
              {{ videoData.video_title }}
            </h3>
            <p class="text-gray-600 mb-4">{{ videoData.video_description }}</p>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-medium text-gray-500">讲师</h4>
                <p class="font-medium">{{ videoData.teacher_name }}</p>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-500">完成率</h4>
                <p class="font-medium text-blue-600">
                  {{ completionRate}}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMyUserStore } from "@/stores/user";
import type { VideoGet, VideoResponse, Progress } from "@/types/video";
definePageMeta({
  title: "课程视频", // 设置页面标题
});
const route = useRoute();
const router = useRouter();
const userStore = useMyUserStore();

// 视频播放器引用
const videoPlayer = ref<HTMLVideoElement | null>(null);
const videoSource = ref("");
const isLoading = ref(true);

// 计时相关状态
const isPlaying = ref(false);
const timerInterval = ref<number | null>(null);
const watchedTime = ref(0); // 已观看时间（秒）
const startTime = ref(0); // 开始播放的时间戳
const lastPlayedTime = ref(0); // 上次暂停时的时间

// 视频信息
const videoData = ref<VideoResponse>({
  video_id: null,
  video_title: "",
  video_description: "",
  video_url: "",
  video_duration: null,
  teacher_name: "",
  course_name: "",
});
const progressData = ref<Progress>({
  progress_id: null,
  student_id: null,
  video_id: null,
  progress: null,
  completed: false,
});

// 1.返回上一页
const goBack = () => {
  router.go(-1);
};
// 完成率计算
const completionRate = computed(() => {
  if (videoData.value.video_duration === 0) return 0;
  
  return Math.min(
    100,
    Math.round((watchedTime.value / videoData.value.video_duration) * 100)
  );
});

// 进度百分比
const progressPercentage = computed(() => {
  if (videoData.value.video_duration === 0) return 0;
  return Math.min(
    100,
    Math.round((watchedTime.value / videoData.value.video_duration) * 100)
  );
});

// 格式化时间 (秒 -> 分:秒)
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// 开始计时
const startTimer = () => {
  if (!videoPlayer.value) return;

  isPlaying.value = true;

  // 记录开始播放的时间点
  startTime.value = Date.now();

  // 清除之前的计时器
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }

  // 设置新的计时器
  timerInterval.value = setInterval(() => {
    if (!videoPlayer.value) return;

    // 计算实际观看时间（防止用户拖动进度条作弊）
    const currentPlayTime = videoPlayer.value.currentTime;

    // 如果当前播放时间大于上次记录的时间，说明是正常播放
    if (currentPlayTime > lastPlayedTime.value) {
      watchedTime.value += 1; // 每秒增加1秒观看时间
    }

    lastPlayedTime.value = currentPlayTime;
  }, 1000) as unknown as number;
};

// 暂停计时
const pauseTimer = () => {
  isPlaying.value = false;

  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};

// 视频结束
const videoEnded = async () => {
  pauseTimer();

  // 计算观看完成率
  const completionRate = Math.round(
    (watchedTime.value / videoData.value.video_duration) * 100
  );
  const completed = completionRate == 100 ? 1 : 0;
  const progress = watchedTime.value / videoData.value.video_duration;
  const res = await $fetch<VideoGet>("/api/student/course-video/videoId", {
    method: "post",
    params: {
      id: route.params.videoId,
      student_id: userStore.user.id,
      completed:completed,
      progress:progress
    },
  });
  console.log(res);
  
};

// 加载视频
const loadVideo = (id: string) => {
  isLoading.value = true;

  // 模拟视频加载延迟
  setTimeout(() => {
    videoSource.value = `/_nuxt/assets/videos/${route.params.videoId}.mp4`;
    isLoading.value = false;
  }, 1000);
};
watch(
  () => route.params.videoId,
  (newVideoId) => {
    if (newVideoId) {
      loadVideo(newVideoId as string);
    }
  },
  { immediate: true }
);
onMounted(async () => {
  
  const res = await $fetch<VideoGet>("/api/student/course-video/videoId", {
    method: "GET",
    params: {
      id: route.params.videoId,
      student_id: userStore.user.id,
    },
  });
  videoData.value = res.video[0];
  progressData.value = res.progress[0];
  watchedTime.value = progressData.value.progress * videoData.value.video_duration;
});
// 组件卸载时清除计时器
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
  videoEnded()
});
</script>

<style scoped>
.shadow-blue {
  box-shadow: 0 4px 6px -1px rgba(30, 64, 175, 0.2),
    0 2px 4px -1px rgba(30, 64, 175, 0.06);
}

video {
  background-color: #000;
  border-radius: 8px;
  aspect-ratio: 16/9;
}

/* 进度条样式 */
.bg-blue-50 {
  background-color: #f0f9ff;
}

/* 按钮悬停效果 */
button:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}
</style>
