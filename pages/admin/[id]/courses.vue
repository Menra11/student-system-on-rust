<template>
  <div>
    <div class=" mx-auto px-4 py-8">
      <!-- 搜索和过滤区域 -->
      <div class="mb-6 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索课程..."
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
                课程ID
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                课程名称
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                学分
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                课室
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                时间表
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                描述
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
              v-for="course in filteredcourses"
              :key="course.course_id"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ course.course_id }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ course.course_name }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ course.credit }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ course.classroom }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ course.schedule }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ course.description }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                <NuxtLink
                  :to="`/admin/${route.params.id}/course/${course.course_id}`"
                  class="text-blue-500 hover:text-blue-700 mr-3 transition-colors"
                  >查看</NuxtLink
                >
                <!-- <button
                  @click="openEditDialog(course)"
                  class="text-green-500 hover:text-green-700 mr-3 transition-colors"
                >
                  编辑
                </button>
                <button
                  @click="openDeleteDialog(course)"
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
  Course,
  CoursesResponse,
} from "~/types/course";

const route = useRoute();

const notificationStore = useMyNotificationStore();

definePageMeta({
  title: "课程管理", // 设置页面标题
});

// 数据状态
const courses = ref<Course[]>([]);
const searchQuery = ref("");

// // 加载状态
// const isLoading = ref(false);
// const isUpdating = ref(false);
// const isDeleting = ref(false);

// // 编辑和删除状态
// const isEditDialogOpen = ref(false);
// const isDeleteDialogOpen = ref(false);
// const currentCourse = ref<Course>();

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
// 过滤后的课程数据
const filteredcourses = computed(() => {
  let result = courses.value
  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (c) =>
        c.course_name.toLowerCase().includes(query) ||
        c.course_id.toString().includes(query) ||
        (c.credit.toString() && c.credit.toString().includes(query)) 
    );
  }
  return result;
});


const refreshData = () => {
  fetchCourses();
};

// // 打开编辑对话框
// const openEditDialog = (course: Course) => {
//   currentCourse.value = { ...course };
//   currentCourse.value.birth_date = formatDate(course.birth_date).replace(
//     /\//g,
//     "-"
//   );
//   isEditDialogOpen.value = true;
// };

// // 关闭编辑对话框
// const closeEditDialog = () => {
//   isEditDialogOpen.value = false;
//   isUpdating.value = false;
// fetchCourses()
// };

// // 更新课程信息
// const updateCourse = async () => {
//   isUpdating.value = true;

//   try {
//     // 发送更新请求
//     const response = await $fetch(
//       `/api/course/${currentCourse.value.course_id}`,
//       {
//         method: "PUT",
//         body: { Course: currentCourse.value },
//       }
//     );
//     console.log(response);

//     if (response.success) {
//       notificationStore.setNotification({
//         message: "课程信息更新成功",
//         type: "success",
//       });
//       closeEditDialog();
//     } else {
//       notificationStore.setNotification({
//         message: `更新失败: ${response.message || "未知错误"}`,
//         type: "error",
//       });
//     }
//   } catch (error) {
//     console.error("更新课程信息失败:", error);
//     notificationStore.setNotification({
//       message: `更新失败: ${error.message || "未知错误"}`,
//       type: "error",
//     });
//   } finally {
//     isUpdating.value = false;
//   }
// };

// // 打开删除对话框
// const openDeleteDialog = (course: Course) => {
//   currentCourse.value = { ...course };
//   isDeleteDialogOpen.value = true;
// };

// // 关闭删除对话框
// const closeDeleteDialog = () => {
//   isDeleteDialogOpen.value = false;
//   isDeleting.value = false;
// fetchCourses()
// };

// // 确认删除
// const confirmDelete = async () => {
//   isDeleting.value = true;

//   try {
//     // 发送删除请求
//     const response = await $fetch(
//       `/api/course/${currentCourse.value.course_id}`,
//       {
//         method: "DELETE",
//       }
//     );

//     if (response.success) {
//       // 从本地数据中移除
//       courses.value = courses.value.filter(
//         (s) => s.course_id !== currentCourse.value.course_id
//       );

//       // 检查当前页是否还有数据
//       if (filteredCourses.value.length === 0 && page.value > 1) {
//         page.value--;
//       }

//       notificationStore.setNotification({
//         message: "课程删除成功",
//         type: "success",
//       });
//       closeDeleteDialog();
//     } else {
//       notificationStore.setNotification({
//         message: `更新失败: ${response.message || "未知错误"}`,
//         type: "error",
//       });
//     }
//   } catch (error: any) {
//     console.error("删除课程失败:", error);
//     notificationStore.setNotification({
//       message: `更新失败: ${error.message || "未知错误"}`,
//       type: "error",
//     });
//   } finally {
//     isDeleting.value = false;
//   }
// };



  


// 初始化
onMounted(() => {
  fetchCourses();
});
</script>

<style scoped></style>
