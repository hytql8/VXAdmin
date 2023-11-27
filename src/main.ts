import { createApp } from "vue"
import App from "./App.vue"
// element plus
import ElementPlus from "element-plus"
import { router, setupRouter } from "@/router"

import { setupStore } from "@/store"
// 引入样式
import "animate.css"
import "./styles/reset.scss"
import "./styles/index.scss"
import "element-plus/dist/index.css"

// createApp(App).mount("#app")
const setupApp = async () => {
  const app = createApp(App)
  // 在页面显示之前先等待router加载完毕
  setupRouter(app)
  // router.isReady()
  // const res = await router.isReady()

  await setupStore(app)
  app.use(ElementPlus).mount("#app")
}
setupApp()
