import { useMyUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useMyUserStore();
  const publicRoutes = ["/", "/login", "/register"];

  // 如果是公共路由，直接放行
  if (publicRoutes.includes(to.path)) {
    return;
  }
  let token: string | undefined;
  if (import.meta.server) {
    token = document.cookie;
  }
  // 客户端环境下从 localStorage 获取 token
  if (import.meta.client) {
    token = localStorage.getItem("token");
  }
  if (token) {
    userStore.setToken(token);
  }
  // 检查 token 是否存在
  if (!userStore.user.token) {
    // 保存原始目标路径，登录后可以重定向回去
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
