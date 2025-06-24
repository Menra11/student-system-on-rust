import { useMyUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useMyUserStore();
  const publicRoutes = ["/login", "/register"];

  // 如果是公共路由，直接放行
  if (publicRoutes.includes(to.path)) {
    return;
  }
  
  // 检查 token 是否存在
  if (!userStore.user.token) {
    // 保存原始目标路径，登录后可以重定向回去
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  // 如果有token，检查用户信息是否已加载
  console.log(userStore.user);

  // 检查登录角色
  if (userStore.user.user_type) {
    // 如果是user_type角色，放行/user_type路径下任意路径
    if (to.path.startsWith(`/${userStore.user.user_type}`)) {
      return;
    }
    return navigateTo(`/${userStore.user.user_type}/${userStore.user.id}`);
  }
});
