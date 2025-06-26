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
<!-- 
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">课程成绩</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-3 px-4 text-left">课程名称</th>
              <th class="py-3 px-4 text-left">学分</th>
              <th class="py-3 px-4 text-left">教师</th>
              <th class="py-3 px-4 text-left">成绩</th>
              <th class="py-3 px-4 text-left">学期</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="score in scores" :key="score.score_id" class="border-t">
              <td class="py-3 px-4">{{ score.course_name }}</td>
              <td class="py-3 px-4">{{ score.credit }}</td>
              <td class="py-3 px-4">{{ score.teacher_name }}</td>
              <td class="py-3 px-4">{{ score.score }}</td>
              <td class="py-3 px-4">{{ score.semester }}</td>
            </tr>
            <tr v-if="scores.length === 0">
              <td colspan="5" class="py-4 text-center text-gray-500">
                暂无成绩记录
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> 
-->

  </div>
</template>

<script setup lang="ts">
import type { Teacher } from "@/types/teacher";
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
  const {Teacher} = await $fetch(`/api/teacher/${route.params.id}`,{
    method: "GET",
  });
  
  if (Teacher) {
    teacher.value = Teacher[0];
  }
}
onMounted( () => {
  fetchTeacher()
});
</script>

<style></style>
