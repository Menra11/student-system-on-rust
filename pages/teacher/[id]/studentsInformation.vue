<template>
  <div>
    <table>
      <thead><tr>
        <th>学生ID</th>
        <th>学生姓名</th>
        <th>课程</th>
        <th>班级</th>
        <th>操作</th>
      </tr></thead>
      <tbody>
        <tr v-for="student in studentsInformation" :key="student.student_id">
          <td>{{ student.student_id }}</td>
          <td>{{ student.student_name }}</td>
          <td>{{ student.course_name }}</td>
          <td>{{ student.class_name }}</td>
          <td>
            <NuxtLink :to="`/teacher/${route.params.id}/${student.student_id}`">查看</NuxtLink>
          </td>
        </tr>
      </tbody >
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { StudentsInformation } from '@/types/teacher/studentsInformation';
const route = useRoute();
definePageMeta({
  title: "学生信息",
});
const studentsInformation = ref<StudentsInformation[]>({
  student_id: 0,
  student_name: '',
  course_name: '',
  class_name: '',
});
const getStudentsInformation = async () => {
  const {StudentsInformation} = await $fetch<StudentsInformation>(
    `/api/teacher/${route.params.id}/studentsInformation`
  );
  studentsInformation.value = StudentsInformation;
};
onMounted(() => {
  getStudentsInformation();
});
</script>

<style>

</style>