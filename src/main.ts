import { createApp } from "vue"
import App from "./App.vue"
import { router, setupRouter } from "@/router"
import { setupStore } from "@/store"
import { setupI18n } from "@/plugins/vueI18n"

// 引入样式
import "animate.css"
import "./styles/reset.scss"
import "./styles/index.scss"

const setupApp = async () => {
  const app = createApp(App)
  // 在页面显示之前先等待router加载完毕
  setupI18n(app)
  setupRouter(app)
  await router.isReady()
  setupStore(app)
  app.mount("#app")
}
setupApp()
