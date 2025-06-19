<template>
  <div>
    {{ $route.params.videoId }}
  </div>
</template>

<script lang="ts" setup>
const $route = useRoute();
console.log($route.params);

</script>

<style>

</style>