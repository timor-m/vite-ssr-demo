import { readFileSync } from 'fs'
import { resolve } from 'path'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import chalk from 'chalk'
import { ofetch } from 'ofetch'

const createSSRServer = async () => {
  const app = express()
  /**
   * Vite 提供的ssr 模式
   * https://cn.vitejs.dev/guide/ssr.html
   * 以中间件模式创建 Vite 应用，这将禁用 Vite 自身的 HTML 服务逻辑
   * 并让上级服务器接管控制
   */
  const vite = await createViteServer({
    server: { 
      middlewareMode: true, 
    },
    appType: 'custom'
  })

  if(process.env.NODE_ENV === 'production') {
    // 设置静态资源
    app.use(express.static("dist/client", {
      etag: true,
      index: false,
    }))
  }

  /**
   * 使用 vite 的 Connect 实例作为中间件
   * 如果你使用了自己的 express 路由（express.Router()），你应该使用 router.use
   */
  app.use(vite.middlewares)

  // 提供一个接口用于演示
  const apis = ['/video_dy']
  const rejectApi = async (req, res) => {
    const url = req.originalUrl
    switch(url) {
      case '/video_dy':
        const data =  await ofetch('https://zj.v.api.aa1.cn/api/video_dyv2')
        res.json(data)
        break;
    }
  }


  app.use('*', async (req , res ) => {
    const isProd = process.env.NODE_ENV === 'production'
    try {
      // 服务 index.html - 下面我们来处理这个问题
      const url = req.originalUrl
      // 额外处理演示的数据接口
      if(apis.includes(url)) {
        await rejectApi(req, res)
        return
      }

      // 读取根目录的模板
      const entry = isProd ? resolve('dist/client/index.html'):resolve('index.html')
      let template = readFileSync(entry, 'utf-8')

      if(!isProd) {
         // 开发环境：转换index.html 使其hmr有效
         template = await vite.transformIndexHtml(url, template)
      }
      
      // 加载server-entry这个文件中的render方法, 根据当前环境处理
      const { render } =isProd ? await import('../dist/server/server-entry.js'): await vite.ssrLoadModule('./src/server-entry.ts')
      
      // 根据url进行渲染
      const { html: appHtml, __data__ } = await render(url)
      
      // 替换注释为准备好的html + 数据脱水
      const html = template.replace(`<!--ssr-outlet-->`, `${appHtml} <script>window.__MY_CACHE__=${JSON.stringify(__data__)}</script>`)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)

    } catch (error) {
      /**
       * 如果捕获到了一个错误，让 Vite 来修复该堆栈，这样它就可以映射回你实际的源码中
       */
      vite.ssrFixStacktrace(error)
      console.error(error)
      res.status(500).end(error.message)
    }
  })

  app.listen(3000)
  console.log(chalk.green('Your SSR server running at: http://localhost:3000'))
}

// 启动服务
createSSRServer()