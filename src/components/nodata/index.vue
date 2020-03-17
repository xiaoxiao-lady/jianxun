<template>
  <div class="nodata">
      <i class="iconfont icon-wushuju"></i>
      <span>暂无数据</span>
  </div>
</template>

<script>
import '@/common/icon/iconfont.css'

export default {
    
}
</script>

<style scoped>

.nodata {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    width: 100%;
    height: 100%;
}
.icon-wushuju {
    font-size: 1.5rem;
    margin-top: 26vh;
    margin-bottom: 5px;
}
.nodata span {
    font-size: .3rem;
}
</style>