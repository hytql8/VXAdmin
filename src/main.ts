import { createApp } from "vue"
import App from "./App.vue"
import { router, setupRouter } from "@/router"
import { setupStore } from "@/store"
import { setupI18n } from "@/plugins/vueI18n"
import { setupVxeTable } from "./plugins/vxeTable"
import { setupAuthDirective } from "./directives/auth"

import "@/router/asyncRouterHelper"

import "animate.css"
import "./styles/reset.scss"
import "./styles/index.scss"

const setupApp = async () => {
  const app = createApp(App)
  setupI18n(app)
  setupRouter(app)
  // 在页面显示之前先等待router加载完毕
  await router.isReady()
  if (process.env.NODE_ENV === "production" && import.meta.env?.VITE_CDN) {
    const { setupElementPlus } = await import("./plugins/elementPlus")
    setupElementPlus(app)
  }
  setupStore(app)
  setupVxeTable(app)
  setupAuthDirective(app)
  app.mount("#app")
}
setupApp()
