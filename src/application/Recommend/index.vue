<script setup lang="ts">
import { RouterView } from 'vue-router'
// import { useRecommendStore } from '@/stores/recommend'
import Scroll from '@/baseUI/scroll/index.vue'
// import Slider from '@/components/slider/index.vue'
// import { storeToRefs } from 'pinia'

// const recommendStore = useRecommendStore()
// const { bannerList, recommendList, enterLoading } = storeToRefs(recommendStore)

// await recommendStore.getBannerList()
// await recommendStore.getRecommendList()
</script>

<template>
  <div class="content">
    <Scroll class="list" onScroll="{forceCheck}">
      <div>
        <!-- <Slider bannerList="bannerList"></Slider> -->
        <!-- <RecommendList recommendList="recommendList"></RecommendList> -->
      </div>
    </Scroll>
    {enterLoading ? (
    <EnterLoading>
      <Loading></Loading>
    </EnterLoading>
    ) : null}
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.content {
  position: fixed;
  top: 94px;
  left: 0;

  /* bottom: ${(props: { play?: any }) => (props.play > 0 ? '60px' : 0)}; */
  bottom: 0;
  width: 100%;
}
</style>
