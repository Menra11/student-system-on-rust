<template>
  <div class="p-6">
    <!-- 搜索和筛选区域 -->
    <div class="mb-6 bg-blue-50 p-4 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >课程名称</label
          >
          <input
            v-model="searchParams.courseName"
            type="text"
            placeholder="搜索课程..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >学分</label
          >
          <select
            v-model="searchParams.credit"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option v-for="c in [1, 2, 3, 4, 5]" :value="c">{{ c }}学分</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >教师</label
          >
          <input
            v-model="searchParams.teacher"
            type="text"
            placeholder="教师姓名..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            重置筛选
          </button>
        </div>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 max-w-28 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              课程信息
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              学分
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              教师
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              时间地点
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="course in filteredCourses" :key="course.course_id">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <font-awesome-icon
                    :icon="['fas', 'book-open']"
                    class="text-blue-600"
                  />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ course.course_name }}
                  </div>
                  <div class="text-sm text-gray-500 line-clamp-2 max-w-md">
                    {{ course.description }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 font-semibold">
                {{ course.credit }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ getTeacherName(course.teacher_id) }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ course.schedule }}</div>
              <div class="text-sm text-gray-500">{{ course.classroom }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button
                v-if="isCourseSelected(course.course_id)"
                @click="dropCourse(course.course_id)"
                class="px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors flex items-center"
              >
                <font-awesome-icon :icon="['fas', 'trash']" class="mr-1" />
                退选
              </button>
              <button
                v-else
                @click="selectCourse(course.course_id)"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors flex items-center"
              >
                <font-awesome-icon :icon="['fas', 'plus']" class="mr-1" />
                选课
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 已选课程 -->
    <div class="mt-8 bg-blue-50 p-6 rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-blue-800 flex items-center">
          <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
          已选课程 ({{ selectedCourses.length }}门)
        </h3>
        <div class="text-sm font-medium">
          总学分: <span class="text-blue-600">{{ totalCredits }}</span>
        </div>
      </div>

      <div
        v-if="selectedCourses.length === 0"
        class="text-center py-6 text-gray-500"
      >
        <font-awesome-icon :icon="['fas', 'inbox']" class="text-3xl mb-2" />
        <p>您还没有选择任何课程</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="course in selectedCourses"
          :key="course.course_id"
          class="bg-white border border-blue-200 rounded-lg p-4 shadow-sm"
        >
          <div class="flex justify-between">
            <h4 class="font-medium text-gray-900">
              {{ course.course_name }}
            </h4>
            <span
              class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full"
            >
              {{ course.credit }}学分
            </span>
          </div>
          <div class="mt-2 text-sm text-gray-600">
            <div class="flex items-center mb-1">
              <font-awesome-icon
                :icon="['fas', 'chalkboard-teacher']"
                class="mr-2 text-gray-400"
              />
              {{ getTeacherName(course.teacher_id) }}
            </div>
            <div class="flex items-center">
              <font-awesome-icon
                :icon="['fas', 'clock']"
                class="mr-2 text-gray-400"
              />
              {{ course.schedule }}
            </div>
            <div class="flex items-center mt-1">
              <font-awesome-icon
                :icon="['fas', 'location-dot']"
                class="mr-2 text-gray-400"
              />
              {{ course.classroom }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-blue-200 flex justify-end">
        <button
          @click="submitSelection"
          class="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">确认选课</span>
          <span v-else class="flex items-center">
            <font-awesome-icon
              :icon="['fas', 'spinner']"
              class="animate-spin mr-2"
            />
            提交中...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course,CoursesResponse } from "@/types/course";
import type { Teacher } from "@/types/teacher";

import { useMyUserStore } from "@/stores/user";
import { useMyNotificationStore } from "@/stores/notification";

const route = useRoute();
const router = useRouter();

const userStore = useMyUserStore();
const notificationStore = useMyNotificationStore();

definePageMeta({
  title: "课程选择",
});
// 教师数据
const teachers = ref<Teacher[]>([{ teacher_id: null, teacher_name: "" }]);

// 课程数据
const courses = ref<Course[]>([
  {
    course_id: null,
    course_name: "",
    credit: null,
    teacher_id: null,
    classroom: "",
    schedule: "",
    description: "",
    video_id: null,
  },
]);

// 选课状态
const selectedCourses = ref([]);
const isSubmitting = ref(false);
const searchParams = ref({
  courseName: "",
  credit: "",
  teacher: "",
});
// 获取所有课程
const getCourses = async () => {
  const {Courses} = await $fetch<CoursesResponse>("/api/course", {
    method: "GET",
  });
  courses.value = Courses;
  // 筛选已选课程
  courses.value = courses.value.filter(
    (course) =>
      !userStore.user.selectedCourses.some(
        (selectedCourse) => selectedCourse === course.course_name
      )
  );
};
// 获取所有教师
const getTeachers = async () => {
  const response = await $fetch<Teacher[]>("/api/teacher", {
    method: "GET",
  });
  teachers.value = response;
};
// 获取教师姓名
const getTeacherName = (teacherId) => {
  const teacher = teachers.value.find((t) => t.teacher_id === teacherId);
  return teacher ? teacher.teacher_name : "未知教师";
};

// 检查课程是否已选
const isCourseSelected = (courseId) => {
  return selectedCourses.value.some((c) => c.course_id === courseId);
};

// 选择课程
const selectCourse = (courseId) => {
  const course = courses.value.find((c) => c.course_id === courseId);
  if (course) {
    // 检查是否已选
    if (!isCourseSelected(courseId)) {
      selectedCourses.value.push({ ...course });
    }
  }
};

// 退选课程
const dropCourse = (courseId) => {
  selectedCourses.value = selectedCourses.value.filter(
    (c) => c.course_id !== courseId
  );
};

// 计算总学分
const totalCredits = computed(() => {
  return selectedCourses.value.reduce((sum, course) => sum + course.credit, 0);
});

// 筛选课程
const filteredCourses = computed(() => {
  return courses.value.filter((course) => {
    const matchesName = searchParams.value.courseName
      ? course.course_name
          .toLowerCase()
          .includes(searchParams.value.courseName.toLowerCase())
      : true;

    const matchesCredit = searchParams.value.credit
      ? course.credit === parseInt(searchParams.value.credit)
      : true;

    const matchesTeacher = searchParams.value.teacher
      ? getTeacherName(course.teacher_id)
          .toLowerCase()
          .includes(searchParams.value.teacher.toLowerCase())
      : true;

    return matchesName && matchesCredit && matchesTeacher;
  });
});

// 重置筛选条件
const resetFilters = () => {
  searchParams.value = {
    courseName: "",
    credit: "",
    teacher: "",
  };
};

// 提交选课
const submitSelection = async () => {
  if (selectedCourses.value.length === 0) {
    notificationStore.setNotification({
      message: "请至少选一门课程",
      type: "error",
    });
    return;
  }

  try {
    isSubmitting.value = true;

    const response = await $fetch(
      `/api/student/${route.params.id}/select-courses`,
      {
        method: "POST",
        params: {
          courses: selectedCourses.value.map((c) => c.course_id),
        },
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    notificationStore.setNotification({
      message: "选课成功",
      type: "success",
    });
    userStore.flashCourses(selectedCourses.value.map((c) => c.course_name));
    navigateTo("/student/" + userStore.user.id + "");
  } catch (error) {
    console.error("选课失败:", error);
    notificationStore.setNotification({
      message: "选课失败，请稍后再试",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  getCourses();
  getTeachers();
});
</script>

<style scoped>
.shadow-blue {
  box-shadow: 0 4px 6px -1px rgba(30, 64, 175, 0.2),
    0 2px 4px -1px rgba(30, 64, 175, 0.06);
}

/* 表格行悬停效果 */
tbody tr {
  transition: background-color 0.2s;
}

tbody tr:hover {
  background-color: #f5f9ff;
}

/* 按钮悬停动画 */
button:not(:disabled) {
  transition: transform 0.1s, background-color 0.2s;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

/* 课程卡片效果 */
.bg-blue-50 {
  background-color: #f0f9ff;
}
</style>
