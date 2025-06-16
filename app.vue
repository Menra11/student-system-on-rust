<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts" >
const route = useRoute()
const router = useRouter()
router.push('/login')
</script>