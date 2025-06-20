<template>
  <div >
      <!-- 表格区域 -->
      <div class="bg-white rounded-lg shadow p-6">
          <div class="overflow-x-auto rounded-lg shadow">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-blue-50" align="center" valign="middle">
                <tr>
                  <th class="px-2 py-2 text-xs text-blue-700 ">学生 ID</th>
                  <th class="px-2 py-2 text-xs text-blue-700 ">学生姓名</th>
                  <th class="px-2 py-2 text-xs text-blue-700 ">课程名</th>
                  <th class="px-2 py-2 text-xs text-blue-700 ">视频标题</th>
                  <th class="px-2 py-2 text-xs text-blue-700 ">视频时长</th>
                  <th class="px-2 py-2 text-xs text-blue-700 ">完成进度</th>
                  <th class="px-2 py-2 text-xs text-blue-700 ">成绩</th>
                  <th class="px-2 py-2 text-xs text-blue-700 ">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200" align="center" valign="middle">
                <tr v-for="(video, index) in videoInfo" :key="index" class="hover:bg-blue-50 transition-colors">
                  <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-800">{{ video.student_id }}</td>
                  <td class="px-2 py-2 text-sm text-gray-600 max-w-xs ">{{ video.student_name }}</td>
                  <td class="px-2 py-2 text-sm text-gray-700 max-w-xs ">{{ video.course_name }}</td>
                  <td class="px-2 py-2 text-sm text-gray-700 font-medium ">{{ video.video_title }}</td>
                  <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-700">{{ formatTime(video.video_duration) }}</td>
                  <td class="px-2 py-2">
                    <div class="flex items-center">
                      <div class="w-24 bg-gray-200 rounded-full h-2 mr-2  text-start">
                        <div 
                          class="bg-blue-600 h-2 rounded-full " 
                          :style="{ width: Math.round(video.progress * 100) + '%' }"
                        ></div>
                      </div>
                      <span class="text-sm text-gray-700">{{ Math.round(video.progress * 100) }}%</span>
                    </div>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <span 
                      :class="{
                        'px-2 py-1 rounded-full text-xs font-medium': true,
                        'bg-red-100 text-red-800': !video.score,
                        'bg-green-100 text-green-800': video.score && video.score >= 60,
                        'bg-yellow-100 text-yellow-800': video.score && video.score < 60
                      }"
                    >
                      {{ video.score || "无成绩" }}
                    </span>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap text-sm">
                    <!-- <button 
                      @click="openScoreDialog(index)"
                      class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      评分
                    </button> -->
                    评分
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 无数据提示 -->
          <div v-if="videoInfo.length === 0" class="text-center py-12">
            <div class="text-gray-500">
              <i class="fas fa-video-slash text-4xl mb-4"></i>
              <p class="text-xl">暂无学生视频学习数据</p>
            </div>
          </div>
      </div>
    <!-- 评分对话框 -->
    <!-- <div v-if="showScoreDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-xl">
          <h3 class="text-lg font-bold">评分</h3>
        </div>
        
        <div class="p-6">
          <div class="mb-4">
            <p class="text-gray-700 mb-2">学生: <span class="font-medium">{{ selectedVideo?.student_id }}</span></p>
            <p class="text-gray-700 mb-2">视频: <span class="font-medium">{{ selectedVideo?.video_title }}</span></p>
          </div>
          
          <div class="mb-6">
            <label for="score" class="block text-sm font-medium text-gray-700 mb-2">输入分数 (0-100)</label>
            <input 
              v-model="scoreInput"
              type="number" 
              min="0" 
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入分数"
            >
            <div v-if="scoreError" class="text-red-500 text-sm mt-1">{{ scoreError }}</div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="closeScoreDialog"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              取消
            </button>
            <button 
              @click="submitScore"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              提交
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import type { VideoInfo,VideoInfoResponse } from "@/types/teacher/videoInfo";
definePageMeta({
  title: "学生视频学习管理",
});
const route = useRoute();

const videoInfo = ref<VideoInfo[]>([
  {
    student_id: 0,
    student_name: "",
    course_name: '',
    video_title: "",
    video_duration: 616,
    progress: 0,
    completed: false,
    score: 0,
  },
]);

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};
const getVideoInfo = async () => {
  const { VideoInfo } = await $fetch<VideoInfoResponse>(
    `/api/teacher/${route.params.id}/videoInfo`,
    {
      method: "GET",
    }
  );
  videoInfo.value = VideoInfo;
};

onMounted(() => {
  getVideoInfo();
});
</script>

<style></style>
