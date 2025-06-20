<template>
  <div>
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- 上传区域 -->
      <div class="bg-white rounded-2xl shadow-blue overflow-hidden mb-8">
        <div class="p-6">
          <div
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            @drop="handleDrop"
            :class="{
              'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer': true,
              'border-blue-500 bg-blue-50': dragOver,
              'border-gray-300': !dragOver,
            }"
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
                <i class="fas fa-cloud-upload-alt text-blue-600 text-2xl"></i>
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
        </div>
      </div>

      <!-- 上传状态 -->
      <div
        v-if="uploadStatus"
        class="bg-white rounded-2xl shadow-blue overflow-hidden mb-8"
      >
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i
                :class="{
                  'text-2xl mr-3': true,
                  'fas fa-spinner animate-spin text-blue-600':
                    uploadStatus === 'uploading',
                  'fas fa-check-circle text-green-600':
                    uploadStatus === 'success',
                  'fas fa-times-circle text-red-600': uploadStatus === 'error',
                }"
              ></i>
            </div>
            <div>
              <h3 class="font-medium text-gray-800">
                {{ statusMessages[uploadStatus].title }}
              </h3>
              <p class="text-gray-600">
                {{ statusMessages[uploadStatus].message }}
              </p>
            </div>
          </div>

          <!-- 进度条 -->
          <div v-if="uploadStatus === 'uploading'" class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                :style="{ width: uploadProgress + '%' }"
              ></div>
            </div>
            <p class="text-sm text-gray-600 mt-2 text-right">
              {{ uploadProgress }}% 完成
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑视频对话框 -->
    <div
      v-if="showEditDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-xl">
          <h3 class="text-lg font-bold">
            {{ editingVideo ? "编辑视频" : "添加视频" }}
          </h3>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >视频标题</label
            >
            <input
              v-model="videoForm.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入视频标题"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >讲师姓名</label
            >
            <input
              v-model="videoForm.lecturer"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入讲师姓名"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >视频描述</label
            >
            <textarea
              v-model="videoForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入视频描述"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >视频时长（分钟）</label
            >
            <input
              v-model="videoForm.duration"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入视频时长"
            />
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="closeEditDialog"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              取消
            </button>
            <button
              @click="saveVideo"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {{ editingVideo ? "更新" : "添加" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
definePageMeta({
  title: "视频管理",
});
// 视频数据类型
interface Video {
  id: number;
  title: string;
  description: string;
  lecturer: string;
  duration: number;
  created_at: string;
}

// 上传状态
const dragOver = ref(false);
const uploadStatus = ref<string | null>(null);
const uploadProgress = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);

// 视频列表
const videos = ref<Video[]>([]);
const showEditDialog = ref(false);
const editingVideo = ref<Video | null>(null);

// 视频表单
const videoForm = ref({
  title: "",
  description: "",
  lecturer: "",
  duration: 30,
});

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

// 打开文件选择器
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

interface Res {
  success: boolean;
  message: string;
  filename: string;
}
// 处理上传
const handleUpload = async (file: File) => {
  if (!file.type.startsWith("video/")) {
    alert("请上传视频文件");
    return;
  }

  // 模拟上传状态
  uploadStatus.value = "uploading";
  uploadProgress.value = 0;

  const formData = new FormData();
  formData.append("video", file);

  try {
    const response = await $fetch<Res>(`/api/uploadVideo`, {
      method: "POST",
      body: formData,
    });

    if (!response.success) {
      throw new Error("上传失败");
    }
    // 上传成功后更新 UI
    uploadStatus.value = "success";
    uploadProgress.value = 100;
  } catch (error) {
    console.error("上传出错:", error);
    uploadStatus.value = "error";
  }
};

// 模拟保存到数据库
const saveVideoToDatabase = (video: Video, filename: string) => {
  console.log("保存视频到数据库:", {
    ...video,
    filename,
    path: `/assets/videos/${filename}`,
  });

  // 实际项目中这里会调用API
  // await $fetch('/api/videos', {
  //   method: 'POST',
  //   body: {
  //     ...video,
  //     filename,
  //     path: `/assets/videos/${filename}`
  //   }
  // });
};

// 关闭编辑对话框
const closeEditDialog = () => {
  showEditDialog.value = false;
  editingVideo.value = null;
  videoForm.value = {
    title: "",
    description: "",
    lecturer: "",
    duration: 30,
  };
};

// 保存视频
const saveVideo = () => {
  if (!videoForm.value.title.trim()) {
    alert("请输入视频标题");
    return;
  }

  if (editingVideo.value) {
    // 更新现有视频
    const index = videos.value.findIndex(
      (v) => v.id === editingVideo.value?.id
    );
    if (index !== -1) {
      videos.value[index] = {
        ...videos.value[index],
        ...videoForm.value,
      };
    }
  } else {
    // 添加新视频
    const newVideo: Video = {
      id: Date.now(),
      title: videoForm.value.title,
      description: videoForm.value.description,
      lecturer: videoForm.value.lecturer,
      duration: videoForm.value.duration,
      created_at: new Date().toISOString(),
    };
    videos.value.unshift(newVideo);
  }

  closeEditDialog();
};
onMounted(() => {});
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
