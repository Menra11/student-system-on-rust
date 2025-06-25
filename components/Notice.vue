<template>
  <!-- 通知消息 -->
  <Transition name="slide-fade">
    <div v-if="noticeData.show" class="fixed top-16 right-8 z-50">
      <div
        :class="[
          'px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 transform',
          noticeData.type === 'success' ? 'bg-blue-400' : 'bg-red-400',
          noticeData.show ? 'translate-x-0' : 'translate-x-full',
        ]"
      >
        <div class="flex items-center">
          <font-awesome-icon
            v-if="noticeData.type === 'success'"
            :icon="['fas', 'check-circle']"
            class="h-5 w-5 mr-2"
          />
          <font-awesome-icon
            v-else
            :icon="['fas', 'exclamation-circle']"
            class="h-5 w-5 mr-2"
          />
          {{ noticeData.message }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
// 通知状态
defineProps<{
  noticeData: {
    show: boolean;
    message: string;
    type: string;
  };
}>();
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
