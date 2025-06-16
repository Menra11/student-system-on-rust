export default defineNuxtRouteMiddleware((to, from) => {
  let passURL = ["/", "/login"];
  // 拦截私人页面
  if (!passURL.includes(to.path)) {
    let token: any = "";
    if (import.meta.client) {
      token = localStorage.getItem("token");
    }
    if (!token) {
      return navigateTo("/login");
    }
  }
});
