<template>
  <div>
    <NuxtLink to="/">返回主页</NuxtLink>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">学生列表</h1>

      <!-- 搜索和过滤区域 -->
      <!-- <div class="mb-6 flex justify-between items-center">
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
      </div> -->

      <!-- 数据表格 -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-3 px-4 border-b text-left">学号</th>
              <th class="py-3 px-4 border-b text-left">姓名</th>
              <th class="py-3 px-4 border-b text-left">性别</th>
              <th class="py-3 px-4 border-b text-left">出生日期</th>
              <th class="py-3 px-4 border-b text-left">班级</th>
              <th class="py-3 px-4 border-b text-left">电话</th>
              <th class="py-3 px-4 border-b text-left">邮箱</th>
              <th class="py-3 px-4 border-b text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in filteredStudents"
              :key="student.student_id"
              class="hover:bg-gray-50"
            >
              <td class="py-3 px-4 border-b">{{ student.student_id }}</td>
              <td class="py-3 px-4 border-b">{{ student.student_name }}</td>
              <td class="py-3 px-4 border-b">
                {{ student.gender }}
              </td>
              <td class="py-3 px-4 border-b">
                {{ formatDate(student.birth_date) }}
              </td>
              <td class="py-3 px-4 border-b">{{ student.class_name }}</td>
              <td class="py-3 px-4 border-b">{{ student.phone }}</td>
              <td class="py-3 px-4 border-b">{{ student.email }}</td>
              <td class="py-3 px-4 border-b">
                <button
                  @click="viewStudent(student.student_id)"
                  class="text-blue-500 hover:text-blue-700 mr-2"
                >
                  查看
                </button>
                <button
                  @click="editStudent(student.student_id)"
                  class="text-green-500 hover:text-green-700 mr-2"
                >
                  编辑
                </button>
                <!-- <button
                  @click="deleteStudent(student.student_id)"
                  class="text-red-500 hover:text-red-700"
                >
                  删除
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页控件 -->
      <div class="mt-6 flex justify-between items-center">
        <div>
          显示 {{ (pagination.page - 1) * pagination.limit + 1 }} 到
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
          条， 共 {{ pagination.total }} 条
        </div>
        <div class="flex space-x-2">
          <button
            @click="prevPage"
            :disabled="pagination.page === 1"
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
              pageNum === pagination.page ? 'bg-blue-500 text-white' : '',
            ]"
          >
            {{ pageNum }}
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.page === pagination.total_pages"
            class="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import type {
  Student,
  Class,
  Pagination,
  StudentResponse,
  ClassResponse,
} from "~/types/student";

// 数据状态
const students = ref<Student[]>([]);
const classes = ref<Class[]>([]);
const searchQuery = ref("");
const classFilter = ref("");
const pagination = ref<Pagination>({
  page: 1,
  limit: 10,
  total: 0,
  total_pages: 1,
});

// 获取学生数据
const fetchStudents = async () => {
  const { student, new_pagination } = await $fetch<StudentResponse>(
    "/api/students",
    {
      method: "GET",
      params: {
        page: pagination.value.page,
        limit: pagination.value.limit,
      },
    }
  );
  if (student && new_pagination) {
    students.value = student;
    pagination.value = {
      page: new_pagination.page,
      limit: new_pagination.limit,
      total: new_pagination.total,
      total_pages: new_pagination.total_pages,
    };
  }
};

// 获取班级数据
// const fetchClasses = async () => {
//   const { data } = await $fetch<ClassResponse>("/api/classes", {
//     method: "get",
//   });
//   if (data) {
//     classes.value = data;
//   }
// };

// 过滤后的学生数据
const filteredStudents = computed(() => {
  let result = students.value;

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

// 分页相关
const visiblePages = computed(() => {
  const pages = [];
  const current = pagination.value.page;
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
  if (pagination.value.page > 1) {
    pagination.value.page--;
    fetchStudents();
  }
};

const nextPage = () => {
  if (pagination.value.page < pagination.value.total_pages) {
    pagination.value.page++;
    fetchStudents();
  }
};

const goToPage = (pageNum: number | string) => {
  if (typeof pageNum === "number") {
    pagination.value.page = pageNum;
    fetchStudents();
  }
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN");
};

// 操作函数
const viewStudent = (id: number) => {
  navigateTo(`/student/${id}`);
};

const editStudent = (id: number) => {
  navigateTo(`/student/${id}/edit`);
};

// const deleteStudent = async (id: number) => {
//   if (confirm("确定要删除这个学生吗？")) {
//     await $fetch(`/api/students/${id}`, {
//       method: "DELETE",
//     });
//     refreshData();
//   }
// };

const refreshData = () => {
  fetchStudents();
  // fetchClasses();
};

// 初始化
onMounted(() => {
  fetchStudents();
  // fetchClasses();
});
</script>

<style scoped>
/* 可以添加一些自定义样式 */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

tr:hover {
  background-color: #f7fafc;
}
</style>
