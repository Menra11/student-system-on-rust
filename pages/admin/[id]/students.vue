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
              <th class="px-2 py-2 text-sm text-blue-700">学号</th>
              <th class="px-2 py-2 text-sm text-blue-700">姓名</th>
              <th class="px-2 py-2 text-sm text-blue-700">性别</th>
              <th class="px-2 py-2 text-sm text-blue-700">出生日期</th>
              <th class="px-2 py-2 text-sm text-blue-700">班级</th>
              <th class="px-2 py-2 text-sm text-blue-700">电话</th>
              <th class="px-2 py-2 text-sm text-blue-700">邮箱</th>
              <th class="px-2 py-2 text-sm text-blue-700">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200" align="center" valign="middle">
            <tr
              v-for="student in filteredStudents"
              :key="student.student_id"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-800">{{ student.student_id }}</td>
              <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-800">{{ student.student_name }}</td>
              <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ student.gender }}
              </td>
              <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-800">
                {{ formatDate(student.birth_date) }}
              </td>
              <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-800">{{ student.class_name }}</td>
              <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-800">{{ student.phone }}</td>
              <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-800">{{ student.email }}</td>
              <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-800">
                <!-- <button
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
                </button> -->
                <!-- <button
                  @click="deleteStudent(student.student_id)"
                  class="text-red-500 hover:text-red-700"
                >
                  删除
                </button> -->
                操作
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

definePageMeta({
  title: "学生管理", // 设置页面标题
});
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
  const { student } = await $fetch<StudentResponse>("/api/admin/students", {
    method: "GET",
  });
  console.log(student);

  // 获取班级数据
  // const fetchClasses = async () => {
  //   const { data } = await $fetch<ClassResponse>("/api/classes", {
  //     method: "get",
  //   });
  //   if (data) {
  //     classes.value = data;
  //   }
  // };

  if (student) {
    students.value = student;
    pagination.value = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      total: student.length,
      total_pages: Math.ceil(student.length / pagination.value.limit),
    };
  }
};
// 过滤后的学生数据
const filteredStudents = computed(() => {
  let result = students.value.slice(
    (pagination.value.page - 1) * pagination.value.limit,
    Math.min(
      pagination.value.page * pagination.value.limit,
      pagination.value.total
    )
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
// const viewStudent = (id: number) => {
//   navigateTo(`/student/${id}`);
// };

// const editStudent = (id: number) => {
//   navigateTo(`/student/${id}/edit`);
// };

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
