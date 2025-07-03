<template>
  <div>
    <div class=" mx-auto px-4 py-8">
      <!-- 搜索和过滤区域 -->
      <div class="mb-6 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索教师..."
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
                教师ID
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                教师姓名
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
              v-for="teacher in filteredteachers"
              :key="teacher.teacher_id"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ teacher.teacher_id }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ teacher.teacher_name }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ teacher.gender }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ formatDate(teacher.birth_date) }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ teacher.title }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ teacher.phone }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ teacher.email }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                <NuxtLink
                  :to="`/admin/${route.params.id}/teacher/${teacher.teacher_id}`"
                  class="text-blue-500 hover:text-blue-700 mr-3 transition-colors"
                  >查看</NuxtLink
                >
                <!-- <button
                  @click="openEditDialog(teacher)"
                  class="text-green-500 hover:text-green-700 mr-3 transition-colors"
                >
                  编辑
                </button>
                <button
                  @click="openDeleteDialog(teacher)"
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
  Teacher,
  TeacherResponse,
  TeachersResponse
} from "~/types/teacher";

const route = useRoute();

const notificationStore = useMyNotificationStore();

definePageMeta({
  title: "教师管理", // 设置页面标题
});

// 数据状态
const teachers = ref<Teacher[]>([]);
const searchQuery = ref("");

// // 加载状态
// const isLoading = ref(false);
// const isUpdating = ref(false);
// const isDeleting = ref(false);

// // 编辑和删除状态
// const isEditDialogOpen = ref(false);
// const isDeleteDialogOpen = ref(false);
// const currentTeacher = ref<Teacher>();

// 获取所有教师
const fetchTeachers = async () => {
  const response = await $fetch<TeachersResponse>(
    "http://127.0.0.1:5800/api/teachers",
    {
      method: "GET",
    }
  );
  if (response.success) {
    teachers.value = response.teachers;
  }
};
// 过滤后的教师数据
const filteredteachers = computed(() => {
  let result = teachers.value
  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (t) =>
        t.teacher_name.toLowerCase().includes(query) ||
        t.teacher_id.toString().includes(query) ||
        (t.phone && t.phone.includes(query)) ||
        (t.email && t.email.toLowerCase().includes(query))
    );
  }
  return result;
});

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const refreshData = () => {
  fetchTeachers();
};

// // 打开编辑对话框
// const openEditDialog = (teacher: Teacher) => {
//   currentTeacher.value = { ...teacher };
//   currentTeacher.value.birth_date = formatDate(teacher.birth_date).replace(
//     /\//g,
//     "-"
//   );
//   isEditDialogOpen.value = true;
// };

// // 关闭编辑对话框
// const closeEditDialog = () => {
//   isEditDialogOpen.value = false;
//   isUpdating.value = false;
// fetchTeachers();
// };

// // 更新教师信息
// const updateTeacher = async () => {
//   isUpdating.value = true;

//   try {
//     // 发送更新请求
//     const response = await $fetch(
//       `/api/teacher/${currentTeacher.value.teacher_id}`,
//       {
//         method: "PUT",
//         body: { Teacher: currentTeacher.value },
//       }
//     );
//     console.log(response);

//     if (response.success) {
//       notificationStore.setNotification({
//         message: "教师信息更新成功",
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
//     console.error("更新教师信息失败:", error);
//     notificationStore.setNotification({
//       message: `更新失败: ${error.message || "未知错误"}`,
//       type: "error",
//     });
//   } finally {
//     isUpdating.value = false;
//   }
// };

// // 打开删除对话框
// const openDeleteDialog = (teacher: Teacher) => {
//   currentTeacher.value = { ...teacher };
//   isDeleteDialogOpen.value = true;
// };

// // 关闭删除对话框
// const closeDeleteDialog = () => {
//   isDeleteDialogOpen.value = false;
//   isDeleting.value = false;
// fetchTeachers();
// };

// // 确认删除
// const confirmDelete = async () => {
//   isDeleting.value = true;

//   try {
//     // 发送删除请求
//     const response = await $fetch(
//       `/api/teacher/${currentTeacher.value.teacher_id}`,
//       {
//         method: "DELETE",
//       }
//     );

//     if (response.success) {
//       // 从本地数据中移除
//       teachers.value = teachers.value.filter(
//         (s) => s.teacher_id !== currentTeacher.value.teacher_id
//       );

//       // 检查当前页是否还有数据
//       if (filteredTeachers.value.length === 0 && page.value > 1) {
//         page.value--;
//       }

//       notificationStore.setNotification({
//         message: "教师删除成功",
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
//     console.error("删除教师失败:", error);
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
  fetchTeachers();
});
</script>

<style scoped></style>
