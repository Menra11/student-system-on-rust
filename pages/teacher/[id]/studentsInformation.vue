<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="overflow-x-auto rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-100" align="center" valign="middle">
          <tr>
            <th class="px-2 py-2 text-sm text-blue-700">学生ID</th>
            <th class="px-2 py-2 text-sm text-blue-700">学生姓名</th>
            <th class="px-2 py-2 text-sm text-blue-700">课程</th>
            <th class="px-2 py-2 text-sm text-blue-700">班级</th>
            <th class="px-2 py-2 text-sm text-blue-700">操作</th>
          </tr>
        </thead>
        <tbody
          class="bg-white divide-y divide-gray-200"
          align="center"
          valign="middle"
        >
          <tr
            class="hover:bg-blue-50 transition-colors"
            v-for="student in studentsInformation"
            :key="student.student_id"
          >
            <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-800">
              {{ student.student_id }}
            </td>
            <td class="px-2 py-2 text-sm text-gray-600 max-w-xs">
              {{ student.student_name }}
            </td>
            <td class="px-2 py-2 text-sm text-gray-600 max-w-xs">
              {{ student.course_name }}
            </td>
            <td class="px-2 py-2 text-sm text-gray-600 max-w-xs">
              {{ student.class_name }}
            </td>
            <td class="px-2 py-2 whitespace-nowrap text-sm">
              <NuxtLink
                :to="`/teacher/${route.params.id}/${student.student_id}`"
                class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >查看</NuxtLink
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  StudentsInfo,
  StudentsInfoResponse,
} from "@/types/teacher/studentsInformation";
const route = useRoute();
definePageMeta({
  title: "学生信息",
});
const studentsInformation = ref<StudentsInfo[]>([
  {
    student_id: 0,
    student_name: "",
    course_name: "",
    class_name: "",
  },
]);
const getStudentsInformation = async () => {
  const response = await $fetch<StudentsInfoResponse>(
    `http://localhost:5800/api/teacher/${route.params.id}/students_info`
  );
  if (response.success) {
    studentsInformation.value = response.students_info;
  }
};
onMounted(() => {
  getStudentsInformation();
});
</script>

<style></style>
