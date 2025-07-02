<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 class="text-xl font-semibold mb-4">基本信息</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-gray-600">教师ID</label>
            <p class="mt-1">{{ teacher.teacher_id }}</p>
          </div>
          <div>
            <label class="block text-gray-600">姓名</label>
            <p class="mt-1">{{ teacher.teacher_name }}</p>
          </div>
          <div>
            <label class="block text-gray-600">性别</label>
            <p class="mt-1">{{ teacher.gender }}</p>
          </div>
          <div>
            <label class="block text-gray-600">出生日期</label>
            <p class="mt-1">{{ formatDate(teacher.birth_date) }}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-4">联系信息</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-gray-600">职位</label>
            <p class="mt-1">{{ teacher.title}}</p>
          </div>
          <div>
            <label class="block text-gray-600">电话</label>
            <p class="mt-1">{{ teacher.phone || "未提供" }}</p>
          </div>
          <div>
            <label class="block text-gray-600">邮箱</label>
            <p class="mt-1">{{ teacher.email || "未提供" }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Teacher,TeacherResponse } from "@/types/teacher";
const route = useRoute();
const router = useRouter();
definePageMeta({
  title: "教师信息",
});

const teacher = ref<Teacher>({
  teacher_id: 0,
  teacher_name: "",
});
// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN");
};
const fetchTeacher = async () => {
  const response = await $fetch<TeacherResponse>(`http://localhost:5800/api/teacher/${route.params.id}`,{
    method: "GET",
  });
  
  if (response.success) {
    teacher.value = response.teacher;
  }
}
onMounted( () => {
  fetchTeacher()
});
</script>

<style></style>
