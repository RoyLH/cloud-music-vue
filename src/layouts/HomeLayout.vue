<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import Player from '@/application/Player/index.vue'

const router = useRouter()
const alertTip = () => alert('用户中心正在开发中，敬请期待:)')
</script>

<template>
  <div class="top">
    <span class="iconfont menu" @click="alertTip"> &#xe65c; </span>
    <span class="title">云音悦</span>
    <span class="iconfont search" @click="router.push('/search')">
      &#xe62b;
    </span>
  </div>
  <div class="tab">
    <RouterLink to="/recommend" v-slot="{ isActive }">
      <div :class="[isActive && 'selected']" class="tab-item">
        <span> 推荐 </span>
      </div>
    </RouterLink>
    <RouterLink to="/singers" v-slot="{ isActive }">
      <div :class="[isActive && 'selected']" class="tab-item">
        <span> 歌手 </span>
      </div>
    </RouterLink>
    <RouterLink to="/rank" v-slot="{ isActive }">
      <div class="tab-item" :class="[isActive && 'selected']">
        <span> 排行榜 </span>
      </div>
    </RouterLink>
  </div>
  <RouterView />
  <Player />
</template>

<style lang="scss" scoped>
.top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 10px;
  background: #d44439;

  & > span {
    line-height: 40px;
    color: #f1f1f1;
    font-size: 20px;

    &.iconfont {
      font-size: 25px;
    }
  }
}

.tab {
  height: 44px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: #d44439;

  a {
    flex: 1;
    padding: 2px 0;
    font-size: 14px;
    color: #e4e4e4;

    div {
      &.selected {
        span {
          padding: 3px 0;
          font-weight: 700;
          color: #f1f1f1;
          border-bottom: 2px solid #f1f1f1;
        }
      }
    }
  }
}

.tab-item {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
