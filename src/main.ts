import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

export const createApp = () => {
  const app = createSSRApp(App)
  app.use(router)
  app.use(createPinia())
  // 现在还不能直接mount() 挂载

  return {
    app,
    router
  }
}