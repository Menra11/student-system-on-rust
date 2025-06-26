<template>
  <div>
    <div class=" mx-auto px-4 py-8">
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
                视频姓名
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                性别
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                出生日期
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                级别
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                电话
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                邮箱
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
                {{ video.video_name }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ video.gender }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ formatDate(video.birth_date) }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ video.title }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ video.phone }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ video.email }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                <NuxtLink
                  :to="`/admin/${route.params.id}/video/${video.video_id}`"
                  class="text-blue-500 hover:text-blue-700 mr-3 transition-colors"
                  >查看</NuxtLink
                >
                <!-- <button
                  @click="openEditDialog(video)"
                  class="text-green-500 hover:text-green-700 mr-3 transition-colors"
                >
                  编辑
                </button>
                <button
                  @click="openDeleteDialog(video)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  删除
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMyNotificationStore } from "@/stores/notification";

import type {
  Video,
  VideoResponse,
  VideosResponse
} from "~/types/video";

const route = useRoute();

const notificationStore = useMyNotificationStore();

definePageMeta({
  title: "视频管理", // 设置页面标题
});

// 数据状态
const videos = ref<Video[]>([]);
const searchQuery = ref("");

// // 加载状态
// const isLoading = ref(false);
// const isUpdating = ref(false);
// const isDeleting = ref(false);

// // 编辑和删除状态
// const isEditDialogOpen = ref(false);
// const isDeleteDialogOpen = ref(false);
// const currentVideo = ref<Video>();

// 获取视频数据
const fetchVideos = async () => {
  const { Videos } = await $fetch<VideosResponse>("/api/admin/videos", {
    method: "GET",
  });
  if (Videos) {
    videos.value = Videos;
  }
};
// 过滤后的视频数据
const filteredvideos = computed(() => {
  let result = videos.value
  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (t) =>
        t.video_name.toLowerCase().includes(query) ||
        t.video_id.toString().includes(query) ||
        (t.phone && t.phone.includes(query)) ||
        (t.email && t.email.toLowerCase().includes(query))
    );
  }
  return result;
});

const refreshData = () => {
  fetchVideos();
};

onUpdated(() => {
  fetchVideos();
});

// 初始化
onMounted(() => {
  fetchVideos();
});
</script>

<style scoped></style>
