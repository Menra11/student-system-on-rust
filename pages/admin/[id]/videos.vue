<template>
  <div>
    <div class="mx-auto px-4 py-8">
      <!-- 搜索和过滤区域 -->
      <div class="mb-6 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索视频..."
            class="px-4 py-2 border rounded-md"
          />
        </div>
        <button
          @click="refreshData"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          刷新数据
        </button>
      </div>

      <!-- 数据表格 -->
      <div class="overflow-x-auto rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-blue-100" align="center" valign="middle">
            <tr>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                视频ID
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                视频标题
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                所属课程
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                视频描述
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                视频时长
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                视频名称
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                操作
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white divide-y divide-gray-200"
            align="center"
            valign="middle"
          >
            <tr
              v-for="video in filteredvideos"
              :key="video.video_id"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ video.video_id }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ video.video_title }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ video.course_name }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ video.video_description }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ formatTime(video.video_duration) }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ video.video_url }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                <NuxtLink
                  :to="`/admin/${route.params.id}/videoInfo/${video.video_id}`"
                  class="text-blue-500 hover:text-blue-700 mr-3 transition-colors"
                  >查看</NuxtLink
                >
                <!-- <button
                  @click="openEditDialog(video)"
                  class="text-green-500 hover:text-green-700 mr-3 transition-colors"
                >
                  编辑
                </button> -->
                <button
                  @click="openDeleteDialog(video)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 添加视频 -->
      <div class="mt-4 w-full">
        <div v-if="!showEditDialog" class="px-6 mb-8">
          <div class="flex flex-row-reverse" v-if="!editDialogLoading">
            <button
              @click="openEditDialog()"
              class="px-3 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <font-awesome-icon :icon="['fas', 'plus']" class="mr-2" />
              添加视频
            </button>
          </div>
          <div class="flex justify-center" v-else>...</div>
        </div>
        <!-- 编辑视频对话框 -->
        <div
          v-else
          class="bg-white rounded-2xl shadow-blue overflow-hidden mb-8"
        >
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
            <!-- 选择课程 -->
            <div class="mb-4">
              <select
                v-model="editingVideo.course_id"
                class="px-4 py-2 border rounded-md"
              >
                <option value="0">所有课程</option>
                <option
                  v-for="cls in courses"
                  :key="cls.course_id"
                  :value="cls.course_id"
                >
                  {{ cls.course_name }}
                </option>
              </select>
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
                    <font-awesome-icon
                      :icon="['fas', 'file-video']"
                      size="lg"
                    />
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
      <!-- 编辑模态框 -->

      <!-- 删除确认模态框 -->
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
            确定要删除视频
            <span class="font-semibold">{{ currentVideo.video_title }}</span>
            (ID: {{ currentVideo.video_id }}) 吗？此操作不可逆。
          </p>

          <div class="flex justify-end space-x-3">
            <button
              @click="closeDeleteDialog"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              取消
            </button>
            <button
              @click="confirmDelete(currentVideo.video_url)"
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
  </div>
</template>

<script setup lang="ts">
import type {
  VideoTitleResponse,
  CourseVideos,
} from "@/types/teacher/videoManagement";
import type { PostResponse } from "@/types/post";
import type { Video, VideosResponse } from "@/types/video";
import type { Course, CoursesResponse } from "@/types/course";

import { useMyNotificationStore } from "@/stores/notification";

const route = useRoute();

const notificationStore = useMyNotificationStore();

definePageMeta({
  title: "视频管理", // 设置页面标题
});

// 数据状态
const videos = ref<Video[]>([]);
const searchQuery = ref("");
const courses = ref<Course[]>([]);
// 加载状态
const isUpdating = ref(false);
const isDeleting = ref(false);

// 编辑和删除状态
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const currentVideo = ref<Video>();
// 编辑状态
const showEditDialog = ref(false);
const editDialogLoading = ref(false);
const editingVideo = ref<CourseVideos | null>({
  video_id: 1,
  video_title: "1",
  video_description: "1",
  video_url: "1",
  video_duration: 1,
  course_id: 0,
});

// 上传状态
const dragOver = ref(false);
const uploadStatus = ref<string | null>(null);
const uploadProgress = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFile = ref<File | null>(null);
const errorMessage = ref("");
// 视频表单
const isLoading = ref(false);

// 获取所有课程
const fetchCourses = async () => {
  const response = await $fetch<CoursesResponse>(
    "http://127.0.0.1:5800/api/courses",
    {
      method: "GET",
    }
  );
  if (response.success) {
    courses.value = response.courses;
  }
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
      course_id: 0,
    };
    // 重置上传状态
    uploadedFile.value = null;
    uploadStatus.value = null;
    uploadProgress.value = 0;
    fetchVideos();
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
const saveVideoToDatabase = async (video: CourseVideos, filename: string) => {
  video.video_url = filename;
  try {
    console.log(video);

    const response = await $fetch<PostResponse>(
      `http://localhost:5800/api/video`,
      {
        method: "POST",
        body: video,
      }
    );
    if (response.success) {
      notificationStore.setNotification({
        message: "上传成功",
        type: "success",
      });
    }
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
  const response = await $fetch<VideoTitleResponse>(
    `http://localhost:5800/api/video_file`,
    {
      method: "POST",
      body: formData,
      query: {
        title: editingVideo.value.video_title,
      },
    }
  );
  if (response.success) {
    openEditDialog();
    await saveVideoToDatabase(editingVideo.value, response.file_name);
  }

  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

// 格式化时间 (秒 -> 分:秒)
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};
// 获取视频数据
const fetchVideos = async () => {
  const response = await $fetch<VideosResponse>(
    "http://localhost:5800/api/videos",
    {
      method: "GET",
    }
  );
  if (response.success) {
    videos.value = response.videos;
  }
};
// 过滤后的视频数据
const filteredvideos = computed(() => {
  let result = videos.value;
  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (v) =>
        v.video_title.toLowerCase().includes(query) ||
        v.video_id.toString().includes(query) ||
        v.video_description.toString().includes(query)
    );
  }
  return result;
});

// 打开删除对话框
const openDeleteDialog = (video: Video) => {
  currentVideo.value = { ...video };
  isDeleteDialogOpen.value = true;
};

// 关闭删除对话框
const closeDeleteDialog = () => {
  isDeleteDialogOpen.value = false;
  isDeleting.value = false;
  fetchVideos();
};

// 确认删除
const confirmDelete = async (url: string) => {
  isDeleting.value = true;

  try {
    // 发送删除请求
    await $fetch(`http://localhost:5800/api/video_file`, {
      method: "DELETE",
      query: {
        url: url,
      },
    });

    const response = await $fetch<PostResponse>(
      `http://localhost:5800/api/video/${currentVideo.value.video_id}`,
      {
        method: "DELETE",
      }
    );

    if (response.success) {
      notificationStore.setNotification({
        message: "视频删除成功",
        type: "success",
      });
      closeDeleteDialog();
    } else {
      notificationStore.setNotification({
        message: `更新失败: ${response.message || "未知错误"}`,
        type: "error",
      });
    }
  } catch (error: any) {
    console.error("删除视频失败:", error);
    notificationStore.setNotification({
      message: `更新失败: ${error.message || "未知错误"}`,
      type: "error",
    });
  } finally {
    isDeleting.value = false;
  }
};

const refreshData = () => {
  fetchVideos();
  fetchCourses();
};

// 初始化
onMounted(() => {
  fetchVideos();
  fetchCourses();
});
</script>

<style scoped></style>
