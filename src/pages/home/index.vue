<template>
  <div>
    <h1>欢迎来到演示案例首页</h1>
    <h2> Vue3 + Vite + VueRouter</h2>
    <router-link :to="'/profile'">去我的个人中心</router-link>
    <div style="margin-top: 200px; color: #999;"> 
         <p>多写点 ，显得我内容比较多！！！！</p>
         <p >在构建 SSR 应用程序时，你可能希望完全控制主服务器，并将 Vite 与生产环境脱钩。因此，建议以中间件模式使用 Vite。</p>
    </div>
   
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

</script>
<style lang="css" scoped>

</style>
