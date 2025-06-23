<template>
  <div class="bg-blue-300 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-blue overflow-hidden">
        <!-- 头部装饰 -->
        <div class="bg-blue-700 py-6 text-center">
          <h1 class="text-2xl font-bold text-white">用户登录</h1>
        </div>

        <!-- 登录表单 -->
        <form class="p-8" ref="loginForm" :model="loginData" rules>
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
          <!-- ID输入框 -->
          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-medium mb-2"
              for="username"
            >
              用户ID
            </label>
            <div class="relative">
              <input
                id="username"
                type="text"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none input-focus transition-all duration-300"
                placeholder="请输入您的ID"
                v-model="loginData.user_id"
              />
              <div
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <font-awesome-icon :icon="['fas', 'user']" />
              </div>
            </div>
          </div>

          <!-- 密码输入框 -->
          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-medium mb-2"
              for="password"
            >
              密码
            </label>
            <div class="relative">
              <input
                id="password"
                type="password"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none input-focus transition-all duration-300"
                placeholder="请输入您的密码"
                v-model="loginData.password"
              />
              <div
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <font-awesome-icon :icon="['fas', 'lock']" />
              </div>
            </div>
          </div>

          <!-- 用户类型选择 -->
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-medium mb-3">
              用户类型
            </label>
            <div class="grid grid-cols-3 gap-3">
              <!-- 学生选项 -->
              <label
                for="学生"
                class="p-3 border border-gray-300 rounded-lg cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-md flex justify-center items-center"
                :class="{
                  'bg-blue-100 border-blue-500': loginData.user === 'student',
                }"
              >
                <input
                  type="radio"
                  name="user"
                  id="学生"
                  value="student"
                  v-model="loginData.user"
                  class="hidden"
                />
                <div class="flex flex-col items-center">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300"
                    :class="
                      loginData.user === 'student'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-600'
                    "
                  >
                    <font-awesome-icon :icon="['fas', 'user-graduate']" />
                  </div>
                  <span class="mt-1">学生</span>
                </div>
              </label>

              <!-- 教师选项 -->
              <label
                for="教师"
                class="p-3 border border-gray-300 rounded-lg cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-md flex justify-center items-center"
                :class="{
                  'bg-blue-100 border-blue-500': loginData.user === 'teacher',
                }"
              >
                <input
                  type="radio"
                  name="user"
                  id="教师"
                  value="teacher"
                  v-model="loginData.user"
                  class="hidden"
                />
                <div class="flex flex-col items-center">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300"
                    :class="
                      loginData.user === 'teacher'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-600'
                    "
                  >
                    <font-awesome-icon :icon="['fas', 'chalkboard-teacher']" />
                  </div>
                  <span class="mt-1">教师</span>
                </div>
              </label>

              <!-- 管理员选项 -->
              <label
                for="管理员"
                class="p-3 border border-gray-300 rounded-lg cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-md flex justify-center items-center"
                :class="{
                  'bg-blue-100 border-blue-500': loginData.user === 'admin',
                }"
              >
                <input
                  type="radio"
                  name="user"
                  id="管理员"
                  value="admin"
                  v-model="loginData.user"
                  class="hidden"
                />
                <div class="flex flex-col items-center">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300"
                    :class="
                      loginData.user === 'admin'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-600'
                    "
                  >
                    <font-awesome-icon :icon="['fas', 'user-shield']" />
                  </div>
                  <span class="mt-1">管理员</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 登录按钮 -->
          <button
            type="button"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            @click="useLogin"
          >
            <span v-if="!isLoading"
              ><font-awesome-icon
                :icon="['fas', 'sign-in-alt']"
                class="mr-2"
              />登录</span
            >
            <span v-else class="flex items-center">
              <font-awesome-icon
                :icon="['fas', 'spinner']"
                class="animate-spin mr-2"
              />
              登录中...
            </span>
          </button>

          <!-- 底部链接 -->
          <div class="flex justify-between items-center mt-6">
            <span
              class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-300 cursor-pointer"
              @click="useRegister"
            >
              <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-1" />
              注册
            </span>
            <a
              href="#"
              class="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300"
            >
              <font-awesome-icon
                :icon="['fas', 'question-circle']"
                class="mr-1"
              />
              <del>忘记密码？</del>
            </a>
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
import type { loginData, LoginResponse } from "@/types/login";
import { useMyUserStore } from "@/stores/user";
const router = useRouter();
const userStore = useMyUserStore();
// 收集输入的账户密码
let loginData = reactive<loginData>({
  user_id: 2025001,
  password: "123456",
  user: "student",
});
// 登录表单响应
let loginForm = ref();
const isLoading = ref(false);
const errorMessage = ref("");
// 登录的回调
let useLogin = async () => {
  errorMessage.value = "";
  if (!validateForm()) return;
  try {
    isLoading.value = true;
    const response = await $fetch<LoginResponse>("/api/login", {
      method: "POST",
      params: {
        user_id: loginData.user_id,
        password: loginData.password,
        user: loginData.user,
      },
    });
    console.log(response);

    if (response.success) {
      userStore.setToken(response.token);
      await userStore.getUser(loginData.user_id,loginData.user);
      
      if (import.meta.server) {
        // 设置cookie，有效期与token相同
        document.cookie = `token=${response.token}; path=/; max-age=${
          60 * 60 * 24
        }`; // 1天
      }
      if (import.meta.client) {
        localStorage.setItem("token", response.token);
      }
      if (loginData.user === "student") {
        router.push(`/student/${loginData.user_id}`);
      } else if (loginData.user === "teacher") {
        router.push(`/teacher/${loginData.user_id}`);
      } else if (loginData.user === "admin") {
        router.push("/students");
      }
    } else {
      // 处理登录失败
      handleLoginError(response);
    }
  } catch (error) {
    console.log(error);

    handleLoginError(error);
  } finally {
    // 重置加载状态
    isLoading.value = false;
  }
};
const validateForm = (): boolean => {
  if (!loginData.user_id.toString().trim()) {
    errorMessage.value = "用户ID不能为空";
    return false;
  }

  if (!loginData.password) {
    errorMessage.value = "密码不能为空";
    return false;
  }

  if (loginData.password.length < 4) {
    errorMessage.value = "密码长度至少为4位";
    return false;
  }

  return true;
};
const handleLoginError = (response: LoginResponse) => {
  // 根据后端返回的错误码显示不同的错误信息
  switch (response.errorCode) {
    case "INVALID_CREDENTIALS":
      errorMessage.value = "用户名或密码错误";
      break;
    case "ACCOUNT_LOCKED":
      errorMessage.value = "账户已被锁定，请联系管理员";
      break;
    case "USER_NOT_FOUND":
      errorMessage.value = "用户不存在";
      break;
    case "INSUFFICIENT_PERMISSION":
      errorMessage.value = "您没有权限登录此系统";
      break;
    default:
      errorMessage.value = response.message || "登录失败，请稍后再试";
  }
};
const handleNetworkError = (error: any) => {
  if (error.response) {
    // 服务器返回了错误状态码
    const status = error.response.status;
    switch (status) {
      case 401:
        errorMessage.value = "身份验证失败";
        break;
      case 403:
        errorMessage.value = "访问被拒绝";
        break;
      case 500:
        errorMessage.value = "服务器内部错误";
        break;
      default:
        errorMessage.value = `请求失败: ${status}`;
    }
  } else if (error.request) {
    // 请求已发送但无响应
    errorMessage.value = "无法连接到服务器，请检查网络连接";
  } else {
    // 其他错误
    errorMessage.value = "发生未知错误: " + error.message;
  }
};
let useRegister = () => {
  router.push("/register");
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
