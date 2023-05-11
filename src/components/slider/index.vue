<script setup lang="ts">
import { onMounted, nextTick, toRefs, watch } from 'vue'
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper'

import 'swiper/css/bundle'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'

Swiper.use([Autoplay, Navigation, Pagination])

const props = defineProps<{
  bannerList: any[]
}>()

const { bannerList } = toRefs(props)

const initSwiper = () => {
  if (!bannerList.value.length) return

  new Swiper('.slider-container', {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    observer: true,
    observeParents: true,
  })
}

onMounted(() => {
  initSwiper()
})

watch(
  bannerList,
  async () => {
    await nextTick()
    initSwiper()
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>

<template>
  <div class="container">
    <div class="before"></div>
    <div class="slider-container">
      <div class="swiper-wrapper">
        <div
          v-for="slider in bannerList"
          :key="slider.imageUrl"
          class="swiper-slide"
        >
          <div class="slider-nav">
            <img :src="slider.imageUrl" width="100%" height="100%" alt="推荐" />
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: auto;
  background: white;

  .before {
    position: absolute;
    top: -300px;
    height: 400px;
    width: 100%;
    /* background: ${style['theme-color']}; */
    background: var(--theme-color);
    z-index: 1;
  }

  .slider-container {
    position: relative;
    width: 98%;
    height: 160px;
    overflow: hidden;
    margin: auto;
    border-radius: 6px;

    .slider-nav {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .swiper-pagination-bullet-active {
      /* background: ${style['theme-color']}; */
      background: var(--theme-color);
    }
  }
}
</style>
