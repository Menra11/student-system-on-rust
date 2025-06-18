import { createPinia } from "pinia";
import piniaPersistedstate from "pinia-plugin-persistedstate";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  if (import.meta.client) {
    pinia.use(piniaPersistedstate);
  }
  nuxtApp.vueApp.use(pinia);
});
