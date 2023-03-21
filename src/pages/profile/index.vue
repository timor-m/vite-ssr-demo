<template>
  <div>
      <h1>个人信息</h1>
      <p style="font-size: 24px;font-weight: bold; color: red;">{{profile.dsc}}</p>
      <p>{{ profile.info}}</p>
      <button @click="router.back()">返回</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useFetch } from '../../utils/useFetch'
import { useRouter } from 'vue-router';

const router = useRouter()
const profile = ref({dsc:'',info:''})
const getData = async () => {
  const  data =  await useFetch('http://localhost:3000/video_dy')
  profile.value = data
}

await getData()
</script>
<style lang="css" scoped>

</style>
