<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRecommendStore } from '@/stores/recommend'
import RecommendList from '@/components/list/index.vue'
import { usePlayerStore } from '@/stores/player'
import Scroll from '@/baseUI/scroll/index.vue'
import Slider from '@/components/slider/index.vue'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'

const scrollRef = ref()

const { bannerList, recommendList, enterLoading } = storeToRefs(
  useRecommendStore()
)
const { playList } = storeToRefs(usePlayerStore())

const { getBannerList, getRecommendList } = useRecommendStore()

onMounted(async () => {
  if (!bannerList.value.length) await getBannerList()
  if (!recommendList.value.length) await getRecommendList()

  scrollRef.value!.refresh()
})
</script>

<template>
  <div class="content" :style="{ bottom: playList.length > 0 ? '60px' : '0' }">
    <Scroll ref="scrollRef">
      <div>
        <Slider :bannerList="bannerList"></Slider>
        <RecommendList :recommendList="recommendList"></RecommendList>
      </div>
    </Scroll>
    <EnterLoading v-if="enterLoading">
      <Loading></Loading>
    </EnterLoading>
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
