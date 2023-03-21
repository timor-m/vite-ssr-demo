import { createApp } from "./main";
import { renderToString } from 'vue/server-renderer'

export const render = async (url:string) => {
  try {
    const { app, router } = createApp()
    /* eslint-disable-next-line */
    app.__data__ = {}
    
    // url跳转一下路径
    router.push(url)
    // 路由准备好
    await router.isReady()
    // 返回一个html
    const html = await renderToString(app)
    
    return { html, __data__:app?.__data__ }
  } catch (error) {
    console.log(error)
  }
}