<template>
  <div class="container mx-auto px-4 max-w-6xl">
    <div class="mb-6">
      <button
        @click="goBack"
        class="flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-2" />
        返回
      </button>
    </div>
    <!-- 视频数据区域 -->
    <div class="bg-white rounded-2xl shadow-blue overflow-hidden mb-8">
      <div class="p-6">
        <div class="overflow-x-auto rounded-lg shadow">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-blue-100" align="center" valign="middle">
              <tr>
                <th class="px-2 py-2 text-sm text-blue-700">课程 ID</th>
                <th class="px-2 py-2 text-sm text-blue-700">视频标题</th>
                <th class="px-2 py-2 text-sm text-blue-700">视频时长</th>
                <th class="px-2 py-2 text-sm text-blue-700">操作</th>
              </tr>
            </thead>
            <tbody
              class="bg-white divide-y divide-gray-200"
              align="center"
              valign="middle"
            >
              <tr
                v-for="(video, item) in videoForm"
                :key="item"
                class="hover:bg-blue-50 transition-colors"
              >
                <td class="px-2 py-2 text-sm text-gray-600 max-w-xs">
                  {{ video.course_id }}
                </td>
                <td class="px-2 py-2 text-sm text-gray-700 max-w-xs">
                  {{ video.video_title }}
                </td>
                <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-700">
                  {{ formatTime(video.video_duration) }}
                </td>
                <td class="px-2 py-2 whitespace-nowrap text-sm">
                  <button
                    @click="openDeleteDialog(video.video_id, video.video_url)"
                    class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 无数据提示 -->
        <div v-if="!videoForm" class="text-center py-12">
          <div class="text-gray-500">
            <font-awesome-icon
              :icon="['fas', 'video-slash']"
              class="text-4xl mb-4 text-gray-400"
            />
            <p class="text-xl">暂无视频数据</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加视频 -->
    <div class="mb-8 w-full">
      <div v-if="!showEditDialog" class="px-6 mb-8">
        <div class="flex flex-row-reverse" v-if="!editDialogLoading">
          <button
            @click="openEditDialog()"
            class="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <font-awesome-icon :icon="['fas', 'plus']" class="mr-2" />
            添加视频
          </button>
        </div>
        <div class="flex justify-center" v-else>...</div>
      </div>
      <!-- 编辑视频对话框 -->
      <div v-else class="bg-white rounded-2xl shadow-blue overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6">
          <h2 class="text-xl font-bold text-white">
            <font-awesome-icon :icon="['fas', 'video']" class="mr-2" />
            添加视频
          </h2>
        </div>
        <div class="p-6">
          <!-- 视频标题 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >视频标题</label
            >
            <input
              v-model="editingVideo.video_title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入视频标题"
            />
          </div>
          <!-- 视频时长（秒） -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >视频时长（秒）</label
            >
            <input
              v-model="editingVideo.video_duration"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入视频时长"
            />
          </div>
          <!-- 视频描述 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >视频描述</label
            >
            <input
              v-model="editingVideo.video_description"
              type="text"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入视频大致内容"
            />
          </div>
          <!-- 上传视频 -->
          <div class="mb-4">
            <div class="block text-sm font-medium text-gray-700 mb-2">
              上传视频
            </div>
            <!-- 上传前状态 -->
            <div
              v-if="!uploadedFile"
              class="border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer bg-blue-50 border-blue-300"
              @dragover.prevent="dragOver = true"
              @dragleave="dragOver = false"
              @drop="handleDrop"
            >
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept="video/*"
                @change="handleFileSelect"
                multiple
              />

              <div class="flex flex-col items-center justify-center">
                <div
                  class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
                >
                  <font-awesome-icon
                    :icon="['fas', 'cloud-upload-alt']"
                    class="text-blue-600 text-2xl"
                  />
                </div>

                <h3 class="text-lg font-medium text-gray-800 mb-2">
                  拖放视频文件到此处上传
                </h3>

                <p class="text-gray-600 mb-4">
                  支持 MP4, AVI, MOV 等常见视频格式
                </p>

                <button
                  @click="openFilePicker"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  选择文件
                </button>

                <p class="text-sm text-gray-500 mt-4">
                  或直接将视频文件拖放到此区域
                </p>
              </div>
            </div>

            <!-- 上传后状态 -->
            <div
              v-if="uploadedFile"
              class="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
            >
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-3 mt-1 text-blue-600">
                  <font-awesome-icon :icon="['fas', 'file-video']" size="lg" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ uploadedFile.name }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ formatFileSize(uploadedFile.size) }} •
                    {{ uploadedFile.type }}
                  </p>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <button
                    @click="removeUploadedFile"
                    class="p-1 text-gray-500 hover:text-red-600"
                  >
                    <font-awesome-icon :icon="['fas', 'times-circle']" />
                  </button>
                </div>
              </div>

              <!-- 上传进度 -->
              <div v-if="uploadStatus === 'uploading'" class="mt-4">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    :style="{ width: uploadProgress + '%' }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-600 mt-2">
                  <span>上传中...</span>
                  <span>{{ uploadProgress }}%</span>
                </div>
              </div>

              <!-- 上传结果 -->
              <div v-if="uploadStatus === 'success'" class="mt-4">
                <div class="flex items-center text-green-600">
                  <font-awesome-icon
                    :icon="['fas', 'check-circle']"
                    class="mr-2"
                  />
                  <span>上传成功！视频已保存</span>
                </div>
              </div>

              <!-- 上传错误 -->
              <div v-if="uploadStatus === 'error'" class="mt-4">
                <div class="flex items-center text-red-600">
                  <font-awesome-icon
                    :icon="['fas', 'exclamation-triangle']"
                    class="mr-2"
                  />
                  <span>上传失败：{{ errorMessage }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="openEditDialog()"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              取消
            </button>
            <button
              @click="saveVideo(uploadedFile)"
              :disabled="uploadStatus != 'success'"
              :class="{
                'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors': true,
                'opacity-50 cursor-not-allowed': uploadStatus != 'success',
              }"
            >
              <span v-if="isLoading" class="flex items-center">
                <font-awesome-icon
                  :icon="['fas', 'spinner']"
                  class="animate-spin mr-2"
                />
                保存中...
              </span>
              <span v-else>保存视频</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 删除视频对话框 -->
    <div
      v-if="isDeleteDialogOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-transform duration-300 scale-100"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">删除确认</h3>
          <button
            @click="closeDeleteDialog"
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="mr-2" />
          </button>
        </div>

        <p class="mb-6 text-gray-700">
          确定要删除该视频
          <span class="font-semibold">{{ currentVideoData.video_id }}</span>
          (文件名: {{ currentVideoData.video_url }}) 吗？此操作不可逆。
        </p>

        <div class="flex justify-end space-x-3">
          <button
            @click="closeDeleteDialog"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmDelete"
            :disabled="isDeleting"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isDeleting" class="flex items-center">
              <font-awesome-icon
                :icon="['fas', 'spinner']"
                class="animate-spin mr-2"
              />
              删除中...
            </span>
            <span v-else> 确认删除 </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  UploadVideoRes,
  CourseVideos,
  CourseVideosResponse,
} from "@/types/teacher/videoManagement";
import type { CourseInfo, CoursesInfoResponse } from "@/types/teacher/course";
import { useMyNotificationStore } from "~/stores/notification";
const route = useRoute();
const router = useRouter();

const notificationStore = useMyNotificationStore();

definePageMeta({
  title: "视频管理",
});

// 编辑状态
const showEditDialog = ref(false);
const editDialogLoading = ref(false);
const editingVideo = ref<CourseVideos | null>({
  video_id: null,
  video_title: "",
  video_description: "",
  video_url: "",
  video_duration: null,
  course_id: null,
});

// 上传状态
const dragOver = ref(false);
const uploadStatus = ref<string | null>(null);
const uploadProgress = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFile = ref<File | null>(null);
const errorMessage = ref("");
const course_id = ref<number>();
// 视频表单
const videoForm = ref<CourseVideos[]>();
const isLoading = ref(false);

// 删除状态
const isDeleteDialogOpen = ref(false);
const isDeleting = ref(false);
const currentVideoData = ref<{ video_id: number; video_url: string }>(null);

// 状态消息
const statusMessages = {
  uploading: {
    title: "上传中...",
    message: "您的视频正在上传，请稍候",
  },
  success: {
    title: "上传成功",
    message: "视频已成功添加到系统",
  },
  error: {
    title: "上传失败",
    message: "视频上传过程中出现问题",
  },
  processing: {
    title: "处理中...",
    message: "正在处理视频文件",
  },
};

const goBack = () => {
  router.go(-1);
};
// 打开添加视频的缓冲
const openEditDialog = () => {
  editDialogLoading.value = !editDialogLoading.value;

  setTimeout(() => {
    showEditDialog.value = !showEditDialog.value;

    editingVideo.value = {
      video_id: null,
      video_title: "",
      video_description: "",
      video_url: "",
      video_duration: null,
      course_id: null,
    };
    // 重置上传状态
    uploadedFile.value = null;
    uploadStatus.value = null;
    uploadProgress.value = 0;
  }, 500);
};

// 删除上传的文件
const removeUploadedFile = () => {
  uploadedFile.value = null;
  uploadStatus.value = null;
  uploadProgress.value = 0;

  if (fileInput.value) {
    fileInput.value.value = "";
  }
};
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}分${secs}秒`;
};
// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]);
}; // 打开文件选择器
const openFilePicker = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 处理文件选择
const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    handleUpload(input.files[0]);
  }
};

// 处理拖放
const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  dragOver.value = false;

  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    handleUpload(e.dataTransfer.files[0]);
  }
};

// 处理上传
const handleUpload = async (file: File) => {
  if (!file.type.startsWith("video/")) {
    errorMessage.value = "请上传视频文件 (MP4, AVI, MOV等)";
    uploadStatus.value = "error";
    return;
  }

  if (file.size > 500 * 1024 * 1024) {
    // 500MB
    errorMessage.value = "文件大小超过500MB限制";
    uploadStatus.value = "error";
    return;
  }

  uploadedFile.value = file;
  uploadStatus.value = "uploading";
  uploadProgress.value = 0;

  const progressInterval = setInterval(() => {
    uploadProgress.value += 10;
    if (uploadProgress.value >= 100) {
      clearInterval(progressInterval);

      setTimeout(() => {
        uploadStatus.value = "success";

        if (!editingVideo.value.video_title) {
          editingVideo.value.video_title = file.name.replace(/\.[^/.]+$/, "");
        }
      }, 500);
    }
  }, 200);
};

// 打开删除对话框
const openDeleteDialog = (videoId: number, videoURL: string) => {
  currentVideoData.value = {
    video_id: videoId,
    video_url: videoURL,
  };
  isDeleteDialogOpen.value = true;
};

// 关闭删除对话框
const closeDeleteDialog = () => {
  isDeleteDialogOpen.value = false;
  isDeleting.value = false;
};

// 确认删除
const confirmDelete = async () => {
  isDeleting.value = true;
  await delVideo(
    currentVideoData.value.video_id,
    currentVideoData.value.video_url
  );
  setTimeout(() => {
    closeDeleteDialog();
  }, 1000);
};

// 删除视频
const delVideo = async (id: number, url: string) => {
  try {
    await $fetch(`/api/delVideoFile`, {
      method: "DELETE",
      params: {
        url,
      },
    });
    await $fetch(`/api/teacher/${route.params.id}/${id}`, {
      method: "DELETE",
    });
    notificationStore.setNotification({
      message: "删除成功",
      type: "success",
    });
  } catch (error) {
    notificationStore.setNotification({
      message: error.message,
      type: "error",
    });
  }
};

const saveVideoToDatabase = async (video: CourseVideos, filename: string) => {
  video.course_id = course_id.value;
  video.video_url = filename;
  try {
    await $fetch(`/api/teacher/${route.params.id}/addVideo`, {
      method: "POST",
      body: video,
    });
    notificationStore.setNotification({
      message: "上传成功",
      type: "success",
    });
  } catch (error) {
    notificationStore.setNotification({
      message: error.message,
      type: "error",
    });
  }
};

const saveVideo = async (file: File) => {
  isLoading.value = true;
  const formData = new FormData();
  formData.append("video", file);

  try {
    const response = await $fetch<UploadVideoRes>(`/api/uploadVideoFile`, {
      method: "POST",
      body: formData,
      params: {
        video_title: editingVideo.value.video_title,
      },
    });

    if (!response.success) {
      throw new Error("上传失败");
    }
    await saveVideoToDatabase(editingVideo.value, response.filename);
    openEditDialog();
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error("上传出错:", error);
  }
};

const updateVideoList = async () => {
  const course_info_response = await $fetch<CoursesInfoResponse>(
    `http://localhost:5800/api/teacher/${route.params.id}/courses_info`,
    {
      method: "GET",
    }
  );
  if (course_info_response.success) {
    let courses_info: CourseInfo = course_info_response.courses_info[0];
    course_id.value = courses_info.course_id;
  }

  const course_videos_response = await $fetch<CourseVideosResponse>(
    `http://localhost:5800/api/teacher/${route.params.id}/course_videos`,
    {
      method: "GET",
    }
  );
  if (course_videos_response.success) {
    videoForm.value = course_videos_response.course_videos;
  }
};
onUpdated(() => {
  updateVideoList();
});
onMounted(() => {
  updateVideoList();
});
</script>

<style scoped>
.shadow-blue {
  box-shadow: 0 4px 6px -1px rgba(30, 64, 175, 0.2),
    0 2px 4px -1px rgba(30, 64, 175, 0.06);
}

.aspect-video {
  aspect-ratio: 16/9;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
