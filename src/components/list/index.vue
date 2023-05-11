<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

defineProps<{
  recommendList: any[]
}>()

const router = useRouter()

const enterDetail = (id: string) => {
  router.push(`/recommend/${id}`)
}

const loadingImgUrl = new URL('./music.png', import.meta.url).href
</script>

<template>
  <div class="list-wrapper">
    <h1 class="title">推荐歌单</h1>
    <div class="list">
      <div
        v-for="(item, index) in recommendList"
        class="list-item"
        :key="item.id + index"
        @click="enterDetail(item.id)"
      >
        <div class="img-wrapper">
          <div class="decorate"></div>
          <img
            v-lazy="{
              src: item.picUrl + '?param=300x300',
              loading: loadingImgUrl,
            }"
            width="100%"
            height="100%"
            alt="music"
          />
          <div class="play-count">
            <i class="iconfont play">&#xe885;</i>
            <span class="count">
              {{ Math.floor(item.playCount / 10000) }}万
            </span>
          </div>
        </div>
        <div class="desc">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-wrapper {
  max-width: 100%;

  .title {
    font-weight: 700;
    padding-left: 6px;
    font-size: 14px;
    line-height: 60px;
  }
}

.list {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;

  &::after {
    content: '';
    flex: auto;
  }
}

.list-item {
  position: relative;
  width: 32%;

  .decorate {
    z-index: 1;
    position: absolute;
    top: 0;
    width: 100%;
    height: 35px;
    border-radius: 3px;
    background: linear-gradient(
      hsla(0deg, 0%, 43%, 0.4),
      hsla(0deg, 0%, 100%, 0)
    );
  }

  .img-wrapper {
    position: relative;
    height: 0;
    padding-bottom: 100%;

    .play-count {
      z-index: 1;
      position: absolute;
      right: 2px;
      top: 2px;
      /* font-size: ${style['font-size-s']}; */
      font-size: var(--font-size-s);
      line-height: 15px;
      /* color: ${style['font-color-light']}; */
      color: var(--font-color-light);

      .play {
        vertical-align: top;
      }
    }

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
  }

  .desc {
    overflow: hidden;
    margin-top: 2px;
    padding: 0 2px;
    height: 50px;
    text-align: left;
    /* font-size: ${style['font-size-s']}; */
    font-size: var(--font-size-s);
    line-height: 1.4;
    /* color: ${style['font-color-desc']}; */
    color: var(--font-color-desc);
  }
}
</style>
