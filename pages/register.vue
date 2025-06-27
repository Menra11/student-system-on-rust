<template>
  <div class="bg-blue-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-blue overflow-hidden">
        <!-- 头部装饰 -->
        <div class="bg-blue-700 py-6 text-center">
          <h1 class="text-2xl font-bold text-white">
            <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2" />
            用户注册
          </h1>
        </div>

        <!-- 注册表单 -->
        <form class="p-8" @submit.prevent="handleSubmit">
          <!-- 错误提示 -->
          <div
            v-if="errorMessage"
            class="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg"
          >
            <div class="flex items-center">
              <font-awesome-icon
                :icon="['fas', 'exclamation-circle']"
                class="mr-2"
              />
              <span>{{ errorMessage }}</span>
            </div>
          </div>

          <!-- 学号 -->
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-medium mb-2"
              for="student_id"
            >
              <font-awesome-icon :icon="['fas', 'id-card']" class="mr-1" />
              学号
            </label>
            <div class="relative">
              <input
                id="student_id"
                type="number"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none input-focus transition-all duration-300"
                placeholder="请输入学号"
                v-model.number="registerData.student_id"
              />
              <div
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <font-awesome-icon :icon="['fas', 'hashtag']" />
              </div>
            </div>
          </div>

          <!-- 姓名 -->
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-medium mb-2"
              for="student_name"
            >
              <font-awesome-icon :icon="['fas', 'user']" class="mr-1" />
              姓名
            </label>
            <div class="relative">
              <input
                id="student_name"
                type="text"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none input-focus transition-all duration-300"
                placeholder="请输入真实姓名"
                v-model="registerData.student_name"
              />
              <div
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <font-awesome-icon :icon="['fas', 'signature']" />
              </div>
            </div>
          </div>

          <!-- 密码 -->
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-medium mb-2"
              for="password"
            >
              <font-awesome-icon :icon="['fas', 'lock']" class="mr-1" />
              注册密码
            </label>
            <div class="relative">
              <input
                id="password"
                type="password"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none input-focus transition-all duration-300"
                placeholder="请输入注册密码"
                v-model="registerData.password"
              />
              <div
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <font-awesome-icon :icon="['fas', 'key']" />
              </div>
            </div>
          </div>

          <!-- 性别 -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">
              <font-awesome-icon :icon="['fas', 'venus-mars']" class="mr-1" />
              性别
            </label>
            <div class="grid grid-cols-2 gap-3">
              <!-- 男性选项 -->
              <label
                class="p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md flex justify-center items-center"
                :class="
                  registerData.gender === '男'
                    ? 'bg-blue-100 border-blue-500'
                    : ' border-gray-300'
                "
              >
                <input
                  type="radio"
                  name="gender"
                  value="男"
                  v-model="registerData.gender"
                  class="hidden"
                />
                <div class="flex flex-col items-center">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xl transition-all duration-300"
                    :class="
                      registerData.gender === '男'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-600'
                    "
                  >
                    <font-awesome-icon :icon="['fas', 'mars']" />
                  </div>
                  <span class="mt-2 font-medium text-gray-700">男</span>
                </div>
              </label>

              <!-- 女性选项 -->
              <label
                class="p-4 border border-gray-300 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md flex justify-center items-center"
                :class="
                  registerData.gender === '女'
                    ? 'bg-pink-100 border-pink-400'
                    : ' border-gray-300'
                "
              >
                <input
                  type="radio"
                  name="gender"
                  value="女"
                  v-model="registerData.gender"
                  class="hidden"
                />
                <div class="flex flex-col items-center">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xl transition-all duration-300"
                    :class="
                      registerData.gender === '女'
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 text-pink-600'
                    "
                  >
                    <font-awesome-icon :icon="['fas', 'venus']" />
                  </div>
                  <span class="mt-2 font-medium text-gray-700">女</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 出生日期 -->
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-medium mb-2"
              for="birth_date"
            >
              <font-awesome-icon
                :icon="['fas', 'calendar-days']"
                class="mr-1"
              />
              出生日期
            </label>
            <div class="relative">
              <input
                id="birth_date"
                type="date"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none input-focus transition-all duration-300"
                v-model="registerData.birth_date"
              />
              <div
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <font-awesome-icon :icon="['fas', 'calendar']" />
              </div>
            </div>
          </div>

          <!-- 班级选择 -->
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-medium mb-2"
              for="class_name"
            >
              <font-awesome-icon
                :icon="['fas', 'graduation-cap']"
                class="mr-1"
              />
              选择班级
            </label>
            <div class="relative">
              <select
                id="class_name"
                v-model="registerData.class_name"
                class="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none input-focus transition-all duration-300 appearance-none bg-white"
              >
                <option value="">请选择</option>
                <option value="计算机科学与技术1班">计算机科学与技术1班</option>
                <option value="计算机科学与技术2班">计算机科学与技术2班</option>
                <option value="软件工程1班">软件工程1班</option>
                <option value="软件工程2班">软件工程2班</option>
                <option value="人工智能1班">人工智能1班</option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"
              >
                <font-awesome-icon :icon="['fas', 'building-columns']" />
              </div>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              >
                <font-awesome-icon :icon="['fas', 'chevron-down']" />
              </div>
            </div>
          </div>

          <!-- 电话 -->
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-medium mb-2"
              for="phone"
            >
              <font-awesome-icon :icon="['fas', 'phone']" class="mr-1" />
              联系电话
            </label>
            <div class="relative">
              <input
                id="phone"
                type="tel"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none input-focus transition-all duration-300"
                placeholder="请输入手机号码"
                v-model="registerData.phone"
              />
              <div
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <font-awesome-icon :icon="['fas', 'mobile-screen']" />
              </div>
            </div>
          </div>

          <!-- 邮箱 -->
          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-medium mb-2"
              for="email"
            >
              <font-awesome-icon :icon="['fas', 'envelope']" class="mr-1" />
              电子邮箱
            </label>
            <div class="relative">
              <input
                id="email"
                type="email"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none input-focus transition-all duration-300"
                placeholder="请输入常用邮箱"
                v-model="registerData.email"
              />
              <div
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <font-awesome-icon :icon="['fas', 'at']" />
              </div>
            </div>
          </div>

          <!-- 注册按钮 -->
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
          >
            <span v-if="!isLoading" class="flex items-center">
              <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2" />
              注册账号
            </span>
            <span v-else class="flex items-center">
              <font-awesome-icon
                :icon="['fas', 'spinner']"
                class="animate-spin mr-2"
              />
              注册中...
            </span>
          </button>

          <!-- 底部链接 -->
          <div class="flex justify-center items-center mt-6">
            <span
              class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-300 cursor-pointer flex items-center"
              @click="goToLogin"
            >
              <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="mr-1" />
              返回登录
            </span>
          </div>
        </form>
      </div>
      <!-- 底部版权信息 -->
      <div class="mt-6 text-center text-white text-sm">
        <p>© 2025 menra 学生管理系统</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { registerData } from "@/types/register";
import { useMyNotificationStore } from "@/stores/notification";

const route = useRoute();
const router = useRouter();

const notificationStore = useMyNotificationStore();

// 注册表单数据
const registerData = reactive<registerData>({
  student_id: 2025001,
  student_name: "xmd",
  gender: "男",
  birth_date: "2025-06-07",
  class_name: "计算机科学与技术2班",
  phone: "18675179658",
  email: "3154975390@qq.com",
  password: "123456",
});

const isLoading = ref(false);
const errorMessage = ref("");

// 表单提交处理
const handleSubmit = async () => {
  // 重置错误消息
  errorMessage.value = "";

  // 表单验证
  if (!validateForm()) return;

  try {
    isLoading.value = true;

    const response = await $fetch("/api/register", {
      method: "POST",
      params: registerData,
    });

    notificationStore.setNotification({
      message: "注册成功",
      type: "success",
    });

    setTimeout(() => {
      isLoading.value = false;
      router.push("/login");
    }, 1500);

  } catch (error) {
    console.error("注册失败:", error);
    errorMessage.value = "注册失败，请稍后再试";
    isLoading.value = false;
  }
};

// 表单验证
const validateForm = (): boolean => {
  if (
    !registerData.student_id ||
    registerData.student_id <= 0 ||
    registerData.student_id.toString().length !== 7
  ) {
    errorMessage.value = "请输入7位有效的学号";
    return false;
  }

  if (!registerData.student_name.trim()) {
    errorMessage.value = "请输入姓名";
    return false;
  }

  if (!registerData.password || registerData.password.length < 6) {
    errorMessage.value = "密码长度至少为6位";
    return false;
  }

  if (!registerData.gender) {
    errorMessage.value = "请选择性别";
    return false;
  }

  if (!registerData.birth_date) {
    errorMessage.value = "请选择出生日期";
    return false;
  }

  if (!registerData.class_name) {
    errorMessage.value = "请选择班级";
    return false;
  }

  if (!/^1[3-9]\d{9}$/.test(registerData.phone)) {
    errorMessage.value = "请输入有效的手机号码";
    return false;
  }

  if (
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(registerData.email)
  ) {
    errorMessage.value = "请输入有效的电子邮箱";
    return false;
  }

  return true;
};

// 返回登录页面
const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.input-focus:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
.shadow-blue {
  box-shadow: 0 4px 6px -1px rgba(30, 64, 175, 0.2),
    0 2px 4px -1px rgba(30, 64, 175, 0.06);
}
</style>
