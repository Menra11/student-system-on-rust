<template>
  <div>
    <NuxtLink to="/students">学生列表</NuxtLink>
    <h1>用户信息</h1>
      <pre>{{ data }}</pre>
  </div>
</template>

<script lang="ts" setup>
interface Student {
  student_id: number;
  student_name: string;
  gender: string;
  birth_date: string;
  class_id: number;
  class_name: string;
  student_phone: string;
  student_email: string;
}
interface Class {
  class_id: number | string;
  class_name: string;
}
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
interface StudentResponse {
  student: Student[];
  new_pagination: Pagination;
}
const page = ref(1)
const limit = ref(10)

const data = await $fetch<StudentResponse>("/api/students", {
  method: "GET",
  params: {
    page: page.value,
    limit: limit.value,
  },
});
</script>

<style></style>
