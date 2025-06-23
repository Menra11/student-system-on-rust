<template>
  <div class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-xl font-semibold mb-4">基本信息</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-600">管理员ID</label>
              <p class="mt-1">{{ admin.admin_id }}</p>
            </div>
            <div>
              <label class="block text-gray-600">姓名</label>
              <p class="mt-1">{{ admin.admin_name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import type { Admin,AdminResponse } from "~/types/admin/admin";
const route = useRoute()
const router = useRouter()
definePageMeta({
  title: '管理员信息'
});
const admin = ref<Admin>({
  admin_id: 0,
  admin_name: '',
})

const fetchAdmin = async () => {
  const { Admin } = await $fetch<AdminResponse>(`/api/admin/${route.params.id}`,{
    method: 'GET'
  })
  if (Admin) {
    admin.value = Admin
  }
}
onMounted(() => {
  fetchAdmin()
})
</script>

<style>

</style>