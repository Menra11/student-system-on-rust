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
    <!-- 表格区域 -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="overflow-x-auto rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-blue-100" align="center" valign="middle">
            <tr>
              <th class="px-2 py-2 text-sm text-blue-700">学生 ID</th>
              <th class="px-2 py-2 text-sm text-blue-700">学生姓名</th>
              <th class="px-2 py-2 text-sm text-blue-700">课程名</th>
              <th class="px-2 py-2 text-sm text-blue-700">成绩</th>
              <th class="px-2 py-2 text-sm text-blue-700">操作</th>
            </tr>
          </thead>
          <tbody
            class="bg-white divide-y divide-gray-200"
            align="center"
            valign="middle"
          >
            <tr
              v-for="(video, index) in scoreInfo"
              :key="index"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ video.student_id }}
              </td>
              <td class="px-2 py-2 text-sm text-gray-600 max-w-xs">
                {{ video.student_name }}
              </td>
              <td class="px-2 py-2 text-sm text-gray-700 max-w-xs">
                {{ video.course_name }}
              </td>
              <td class="px-2 py-2 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 rounded-full text-xs font-medium': true,
                    'bg-red-100 text-red-800': !video.score,
                    'bg-green-100 text-green-800':
                      video.score && video.score >= 60,
                    'bg-yellow-100 text-yellow-800':
                      video.score && video.score < 60,
                  }"
                >
                  {{ video.score || "无成绩" }}
                </span>
              </td>
              <td class="px-2 py-2 whitespace-nowrap text-sm">
                <button
                  @click="openScoreDialog(video)"
                  class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  评分
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 无数据提示 -->
      <div v-if="scoreInfo.length === 0" class="text-center py-12">
        <div class="text-gray-500">
          <i class="fas fa-video-slash text-4xl mb-4"></i>
          <p class="text-xl">暂无学生视频学习数据</p>
        </div>
      </div>
    </div>
    <!-- 评分对话框 -->
    <div
      v-if="showScoreDialog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-xl">
          <h3 class="text-lg font-bold">评分</h3>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <p class="text-gray-700 mb-2">
              学生Id:
              <span class="font-medium">{{ selectedVideo?.student_id }}</span>
            </p>
            <p class="text-gray-700 mb-2">
              学生:
              <span class="font-medium">{{ selectedVideo?.student_name }}</span>
            </p>
            <p class="text-gray-700 mb-2">
              课程:
              <span class="font-medium">{{ selectedVideo?.course_name }}</span>
            </p>
          </div>

          <div class="mb-6">
            <label
              for="score"
              class="block text-sm font-medium text-gray-700 mb-2"
              >输入分数 (0-100)</label
            >
            <input
              v-model="scoreInput"
              type="number"
              min="0"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入分数"
            />
            <div v-if="scoreError" class="text-red-500 text-sm mt-1">
              {{ scoreError }}
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="closeScoreDialog"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              取消
            </button>
            <button
              @click="submitScore()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
            <span v-if="isUpdating" class="flex items-center">
                  <font-awesome-icon
                    :icon="['fas', 'spinner']"
                    class="animate-spin mr-2"
                  />
                  保存中...
                </span>
              <span v-else>提交</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ScoreInfo, ScoresInfoResponse } from "@/types/teacher/scoreInfo";
import { useMyNotificationStore } from "~/stores/notification";
definePageMeta({
  title: "学生成绩管理",
});
const route = useRoute();
const router = useRouter();

const notificationStore = useMyNotificationStore();

const scoreInfo = ref<ScoreInfo[]>([
  {
    student_id: 0,
    student_name: "",
    course_id: 0,
    course_name: "",
    score: 0,
  },
]);

const selectedVideo = ref<ScoreInfo | null>(null);
const scoreInput = ref<number | null>(null);
const scoreError = ref<string | null>(null);

const showScoreDialog = ref(false);
const isUpdating = ref(false);
const openScoreDialog = (scoreInfo: ScoreInfo) => {
  showScoreDialog.value = true;
  selectedVideo.value = scoreInfo;
};

const closeScoreDialog = () => {
  showScoreDialog.value = false;
  selectedVideo.value = null;
};

const submitScore = async () => {
  isUpdating.value = true;
  if (!scoreInput.value) {
    scoreError.value = "请输入分数";
    return;
  }
  const res = await $fetch(
    `http://localhost:5800/api/teacher/${route.params.id}`,
    {
      method: "POST",
      body: {
        student_id:selectedVideo.value?.student_id,
        course_id:selectedVideo.value?.course_id,
        score: scoreInput.value,
      },
    }
  );
  if (selectedVideo.value.score) {
    notificationStore.setNotification({
      message: "成绩更改成功",
      type: "success",
    });
  } else {
    notificationStore.setNotification({
      message: "成绩添加成功",
      type: "success",
    });
  }
  setTimeout(() => {
    isUpdating.value = false;
    getScoreInfo();
    closeScoreDialog();
  }, 800);
};
const goBack = () => {
  router.go(-1);
};
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};
const getScoreInfo = async () => {
  const response = await $fetch<ScoresInfoResponse>(
    `http://localhost:5800/api/teacher/${route.params.id}/scores_info`,
    {
      method: "GET",
    }
  );
  if (response.success) {
    scoreInfo.value = response.scores_info;
  }
  
};

onMounted(() => {
  getScoreInfo();
});
</script>

<style></style>
