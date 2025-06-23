<template>
  <div class="container mx-auto px-4 max-w-6xl">
    <!-- 视频数据区域 -->
    <div class="bg-white rounded-2xl shadow-blue overflow-hidden mb-8">
      <div class="p-6">
        <div class="overflow-x-auto rounded-lg shadow">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-blue-50" align="center" valign="middle">
              <tr>
                <th class="px-2 py-2 text-xs text-blue-700">课程 ID</th>
                <th class="px-2 py-2 text-xs text-blue-700">视频标题</th>
                <th class="px-2 py-2 text-xs text-blue-700">视频时长</th>
                <th class="px-2 py-2 text-xs text-blue-700">操作</th>
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
                  <!-- <button 
                      @click="openScoreDialog(index)"
                      class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      操作
                    </button> -->
                  操作
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
              保存视频
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  UploadVideoRes,
  Video,
  VideoResponse,
} from "@/types/teacher/videoManagement";
import type { CourseResponse } from "@/types/teacher/course";
const route = useRoute();
const router = useRouter();
definePageMeta({
  title: "视频管理",
});

// 编辑状态
const showEditDialog = ref(false);
const editDialogLoading = ref(false);
const editingVideo = ref<Video | null>({
  video_title: "t",
  video_description: "描述",
  video_url: "地址",
  video_duration: 300,
  course_id: 10001,
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
const videoForm = ref<Video[]>();

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

// 打开添加视频的缓冲
const openEditDialog = () => {
  editDialogLoading.value = !editDialogLoading.value;

  setTimeout(() => {
    showEditDialog.value = !showEditDialog.value;
    editingVideo.value = {
      video_title: "t",
      video_description: "描述",
      video_url: "地址",
      video_duration: 300,
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
  // 模拟上传过程
  const progressInterval = setInterval(() => {
    uploadProgress.value += 10;
    if (uploadProgress.value >= 100) {
      clearInterval(progressInterval);

      // 模拟上传成功
      setTimeout(() => {
        uploadStatus.value = "success";

        // 自动生成视频标题
        if (!editingVideo.value.video_title) {
          editingVideo.value.video_title = file.name.replace(/\.[^/.]+$/, "");
        }
      }, 500);
    }
  }, 200);
};

// 模拟保存到数据库
const saveVideoToDatabase = async (video: Video, filename: string) => {
  // 实际项目中这里会调用API
  video.course_id = course_id.value;
  video.video_url = filename;
  try {
    await $fetch(`/api/teacher/${route.params.id}/addVideo`, {
      method: "POST",
      body: video,
    });
    console.log("保存成功");
  } catch (error) {
    console.log(error);
  }
};

const saveVideo = async (file: File) => {
  const formData = new FormData();
  formData.append("video", file);

  try {
    const response = await $fetch<UploadVideoRes>(`/api/uploadVideo`, {
      method: "POST",
      body: formData,
      params: {
        video_title: editingVideo.value.video_title,
      },
    });

    if (!response.success) {
      throw new Error("上传失败");
    }
    saveVideoToDatabase(editingVideo.value, response.filename);
    openEditDialog();
  } catch (error) {
    console.error("上传出错:", error);
  }
};

const updateVideoList = async () => {
  const { CoursesInformation } = await $fetch<CourseResponse>(
    `/api/teacher/${route.params.id}/coursesInfo`,
    {
      method: "GET",
    }
  );
  course_id.value = CoursesInformation[0].course_id;
  const { Videos } = await $fetch<VideoResponse>(
    `/api/teacher/${route.params.id}/video`,
    {
      method: "GET",
      params: {
        course_id: course_id.value,
      },
    }
  );
  videoForm.value = Videos;
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
