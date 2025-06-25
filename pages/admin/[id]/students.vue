<template>
  <div>
    <div class="container mx-auto px-4 py-8">
      <!-- 搜索和过滤区域 -->
      <div class="mb-6 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索学生..."
            class="px-4 py-2 border rounded-md"
          />
          <select v-model="classFilter" class="px-4 py-2 border rounded-md">
            <option value="">所有班级</option>
            <option
              v-for="cls in classes"
              :key="cls.class_id"
              :value="cls.class_id"
            >
              {{ cls.class_name }}
            </option>
          </select>
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
          <thead class="bg-blue-50" align="center" valign="middle">
            <tr>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                学号
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                姓名
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                性别
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                出生日期
              </th>
              <th class="px-3 py-4 text-sm whitespace-nowrap text-blue-700">
                班级
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
              v-for="student in filteredStudents"
              :key="student.student_id"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ student.student_id }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ student.student_name }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ student.gender }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ formatDate(student.birth_date) }}
              </td>
              <td class="px-3 py-2 text-sm text-gray-800">
                {{ student.class_name }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ student.phone }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ student.email }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                <button
                  @click="openEditDialog(student)"
                  class="text-green-500 hover:text-green-700 mr-3 transition-colors"
                >
                  编辑
                </button>
                <button
                  @click="openDeleteDialog(student)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页控件 -->
      <div class="mt-6 flex justify-between items-center">
        <div>
          显示 {{ viewPagination.total ? (page - 1) * limit + 1 : 0 }} 到
          {{ Math.min(page * limit, viewPagination.total) }}
          条， 共 {{ viewPagination.total }} 条
        </div>
        <div class="flex space-x-2">
          <button
            @click="prevPage"
            :disabled="page === 1"
            class="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            上一页
          </button>
          <button
            v-for="pageNum in visiblePages"
            :key="pageNum"
            @click="goToPage(pageNum)"
            :class="[
              'px-4 py-2 border rounded-md',
              pageNum === page ? 'bg-blue-500 text-white' : '',
            ]"
          >
            {{ pageNum }}
          </button>
          <button
            @click="nextPage"
            :disabled="page === pagination.total_pages"
            class="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="flex items-center">
            <font-awesome-icon
              :icon="['fas', 'spinner']"
              class="animate-spin mr-2"
            />
            <span class="ml-3 text-lg">加载中...</span>
          </div>
        </div>
      </div>

      <!-- 编辑模态框 -->
      <div
        v-if="isEditDialogOpen"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
          <div
            class="flex justify-between items-center rounded-t-2xl bg-blue-700"
          >
            <!-- 头部装饰 -->
            <div class="pl-6 py-6 text-center">
              <h1 class="text-2xl font-bold text-white">
                <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2" />
                编辑学生信息
              </h1>
            </div>
            <button
              @click="closeEditDialog"
              class="pr-6 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="mr-2" />
            </button>
          </div>
          <form class="p-4" @submit.prevent="updateStudent">
            <div class="flex flex-row flex-wrap">
              <!-- 学号 -->
              <div class="basis-1/2 p-2">
                <label
                  class="block text-gray-700 text-sm font-medium mb-2"
                  for="student_id"
                >
                  <font-awesome-icon :icon="['fas', 'id-card']" class="mr-1" />
                  学号
                </label>
                <input
                  id="student_id"
                  v-model="currentStudent.student_id"
                  type="text"
                  class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>
              <!-- 姓名 -->
              <div class="basis-1/2 p-2">
                <label
                  class="block text-gray-700 text-sm font-medium mb-2"
                  for="student_name"
                >
                  <font-awesome-icon :icon="['fas', 'user']" class="mr-1" />
                  姓名
                </label>
                <input
                  id="student_name"
                  v-model="currentStudent.student_name"
                  type="text"
                  class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <!-- 性别 -->
              <div class="basis-1/2 p-2">
                <label class="block text-gray-700 text-sm font-medium mb-2">
                  <font-awesome-icon
                    :icon="['fas', 'venus-mars']"
                    class="mr-1"
                  />
                  性别
                </label>

                <div class="grid grid-cols-2 gap-3">
                  <!-- 男性选项 -->
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="男"
                      v-model="currentStudent.gender"
                      class="hidden"
                    />
                    <div class="flex flex-col items-center">
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center text-xl transition-all duration-300"
                        :class="
                          currentStudent.gender === '男'
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-100 text-blue-600'
                        "
                      >
                        <font-awesome-icon :icon="['fas', 'mars']" />
                      </div>
                    </div>
                  </label>
                  <!-- 女性选项 -->
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="女"
                      v-model="currentStudent.gender"
                      class="hidden"
                    />
                    <div class="flex flex-col items-center">
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center text-xl transition-all duration-300"
                        :class="
                          currentStudent.gender === '女'
                            ? 'bg-pink-500 text-white'
                            : 'bg-pink-100 text-pink-600'
                        "
                      >
                        <font-awesome-icon :icon="['fas', 'venus']" />
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <!-- 出生日期 -->
              <div class="basis-1/2 p-2">
                <label
                  class="block text-gray-700 text-sm font-medium mb-2"
                  for="birth_date"
                >
                  <font-awesome-icon
                    :icon="['fas', 'calendar-days']"
                    class="mr-1"
                  />
                  出生日期
                </label>
                <input
                  id="birth_date"
                  v-model="currentStudent.birth_date"
                  type="date"
                  class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <!-- 班级 -->
              <div class="basis-1/2 p-2">
                <label
                  class="block text-gray-700 text-sm font-medium mb-2"
                  for="class_name"
                >
                  <font-awesome-icon
                    :icon="['fas', 'graduation-cap']"
                    class="mr-1"
                  />
                  选择班级
                </label>
                <select
                  v-model="currentStudent.class_id"
                  class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option
                    v-for="cls in classes"
                    :key="cls.class_id"
                    :value="cls.class_id"
                  >
                    {{ cls.class_name }}
                  </option>
                </select>
              </div>
              <!-- 电话 -->
              <div class="basis-1/2 p-2">
                <label
                  class="block text-gray-700 text-sm font-medium mb-2"
                  for="phone"
                >
                  <font-awesome-icon :icon="['fas', 'phone']" class="mr-1" />
                  联系电话
                </label>
                <input
                  id="phone"
                  v-model="currentStudent.phone"
                  type="tel"
                  class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入手机号码"
                />
              </div>
              <!-- 邮箱 -->
              <div class="basis-1/1 p-2">
                <label
                  class="block text-gray-700 text-sm font-medium mb-2"
                  for="email"
                >
                  <font-awesome-icon :icon="['fas', 'envelope']" class="mr-1" />
                  电子邮箱
                </label>
                <input
                  v-model="currentStudent.email"
                  type="email"
                  class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@domain.com"
                />
              </div>
            </div>
            <!-- 按钮 -->
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeEditDialog"
                class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="isUpdating"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="isUpdating" class="flex items-center">
                  <font-awesome-icon
                    :icon="['fas', 'spinner']"
                    class="animate-spin mr-2"
                  />
                  保存中...
                </span>
                <span v-else> 保存 </span>
              </button>
            </div>
          </form>
        </div>
      </div>

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
            确定要删除学生
            <span class="font-semibold">{{ currentStudent.student_name }}</span>
            (学号: {{ currentStudent.student_id }}) 吗？此操作不可逆。
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
  </div>
</template>

<script setup lang="ts">
import { useMyNotificationStore } from "@/stores/notification";

const notificationStore = useMyNotificationStore();
import type {
  Student,
  Class,
  Pagination,
  StudentsResponse,
  ClassResponse,
} from "~/types/student";

definePageMeta({
  title: "学生管理", // 设置页面标题
});
// 数据状态
const students = ref<Student[]>([]);
const classes = ref<Class[]>([]);
const searchQuery = ref("");
const classFilter = ref("");
const page = ref(1);
const limit = ref(10);
const pagination = ref<Pagination>({
  total: 0,
  total_pages: 1,
});
const viewPagination = ref<Pagination>({
  total: 0,
  total_pages: 1,
});

// 加载状态
const isLoading = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);

// 编辑和删除状态
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const currentStudent = ref<Student>();

// 获取班级数据
const fetchClasses = async () => {
  const { Classes } = await $fetch<ClassResponse>("/api/admin/classes", {
    method: "get",
  });
  if (Classes) {
    classes.value = Classes;
  }
};

// 获取学生数据
const fetchStudents = async () => {
  const { Students } = await $fetch<StudentsResponse>("/api/admin/students", {
    method: "GET",
  });
  if (Students) {
    students.value = Students;
    pagination.value = {
      total: students.value.length,
      total_pages: Math.ceil(students.value.length / limit.value),
    };
    viewPagination.value = {
      total: students.value.length,
      total_pages: Math.ceil(students.value.length / limit.value),
    };
  }
};
// 过滤后的学生数据
const filteredStudents = computed(() => {
  let result = students.value.slice(
    (page.value - 1) * limit.value,
    Math.min(page.value * limit.value, pagination.value.total)
  );
  // 按班级过滤
  if (classFilter.value) {
    result = result.filter((s) => s.class_id === Number(classFilter.value));
  }
  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (s) =>
        s.student_name.toLowerCase().includes(query) ||
        s.student_id.toString().includes(query) ||
        (s.phone && s.phone.includes(query)) ||
        (s.email && s.email.toLowerCase().includes(query))
    );
  }
  return result;
});
watchEffect(() => {
  const result = filteredStudents.value;
  viewPagination.value = {
    total: result.length,
    total_pages: Math.ceil(result.length / limit.value),
  };
});
// 分页相关
const visiblePages = computed(() => {
  const pages = [];
  const current = page.value;
  const total = pagination.value.total_pages;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, "...", total);
    } else if (current >= total - 2) {
      pages.push(1, "...", total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
  }

  return pages;
});

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchStudents();
  }
};

const nextPage = () => {
  if (page.value < pagination.value.total_pages) {
    page.value++;
    fetchStudents();
  }
};

const goToPage = (pageNum: number | string) => {
  if (typeof pageNum === "number") {
    page.value = pageNum;
    fetchStudents();
  }
};

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
  fetchStudents();
  fetchClasses();
};

// 打开编辑对话框
const openEditDialog = (student: Student) => {
  currentStudent.value = { ...student };
  currentStudent.value.birth_date = formatDate(student.birth_date).replace(
    /\//g,
    "-"
  );
  isEditDialogOpen.value = true;
};

// 关闭编辑对话框
const closeEditDialog = () => {
  isEditDialogOpen.value = false;
  isUpdating.value = false;
};

// 更新学生信息
const updateStudent = async () => {
  isUpdating.value = true;

  try {
    // 发送更新请求
    const response = await $fetch(
      `/api/student/${currentStudent.value.student_id}`,
      {
        method: "PUT",
        body: { Student: currentStudent.value },
      }
    );
    console.log(response);

    if (response.success) {
      notificationStore.setNotification({
        message: "学生信息更新成功",
        type: "success",
      });
      closeEditDialog();
    } else {
      notificationStore.setNotification({
        message: `更新失败: ${response.message || "未知错误"}`,
        type: "error",
      });
    }
  } catch (error) {
    console.error("更新学生信息失败:", error);
    notificationStore.setNotification({
      message: `更新失败: ${error.message || "未知错误"}`,
      type: "error",
    });
  } finally {
    isUpdating.value = false;
  }
};

// 打开删除对话框
const openDeleteDialog = (student: Student) => {
  currentStudent.value = { ...student };
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

  try {
    // 发送删除请求
    const response = await $fetch(
      `/api/student/${currentStudent.value.student_id}`,
      {
        method: "DELETE",
      }
    );

    if (response.success) {
      // 从本地数据中移除
      students.value = students.value.filter(
        (s) => s.student_id !== currentStudent.value.student_id
      );

      // 检查当前页是否还有数据
      if (filteredStudents.value.length === 0 && page.value > 1) {
        page.value--;
      }

      notificationStore.setNotification({
      message: '学生删除成功',
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
    console.error("删除学生失败:", error);
    notificationStore.setNotification({
      message: `更新失败: ${error.message || "未知错误"}`,
      type: "error",
    });
  } finally {
    isDeleting.value = false;
  }
};

onUpdated(() => {
  fetchStudents();
});

// 初始化
onMounted(() => {
  fetchStudents();
  fetchClasses();
});
</script>

<style scoped></style>
