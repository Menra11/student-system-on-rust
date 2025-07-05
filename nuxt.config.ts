// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  ssr: false,
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  css: [
    "~/assets/css/main.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    strict: false,
  },
  features: {
    // 预取视口内的链接
    inlineStyles: false
  },

  vue: {
    compilerOptions: {
      // 开启 Vue 级别的优化
      whitespace: 'condense'
    }
  }
});
