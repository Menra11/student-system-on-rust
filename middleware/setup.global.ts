import { useMyUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useMyUserStore();
  const publicRoutes = ["/", "/login", "/register"];

  // 如果是公共路由，直接放行
  if (publicRoutes.includes(to.path)) {
    return;
  }
  console.log(userStore.user);
  // 检查 token 是否存在
  if (!userStore.user.token) {
    // 保存原始目标路径，登录后可以重定向回去
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
