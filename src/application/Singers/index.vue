<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSingersStore } from '@/stores/singers'
import { usePlayerStore } from '@/stores/player'
import { alphaTypes, categoryTypes } from '@/api/config'
import Scroll from '@/baseUI/scroll/index.vue'
import Horizen from '@/baseUI/horizen-item/index.vue'
import Loading from '@/baseUI/loading/index.vue'
import EnterLoading from '@/baseUI/enter-loading/index.vue'

const loadingImgUrl = new URL('./singer.png', import.meta.url).href

const {
  alpha,
  category,
  singerList,
  enterLoading,
  pullUpLoading,
  pullDownLoading,
  // pageCount,
} = storeToRefs(useSingersStore())

const { playList } = storeToRefs(usePlayerStore())

const {
  changeCategory,
  changeAlpha,
  changeListOffset,
  changePullUpLoading,
  changePullDownLoading,
  getSingerList,
  getHotSingerList,
  refreshMoreSingerList,
  refreshMoreHotSingerList,
} = useSingersStore()

const scrollRef = ref<any>(null)

const router = useRouter()

const getHotSinger = async () => {
  await getHotSingerList()
}

const updateCategory = async (newVal: string) => {
  changeCategory(newVal)
  await getHotSingerList()
}

const updateAlpha = async (newVal: string) => {
  changeAlpha(newVal)
  await getHotSingerList()
}

// 滑到最底部刷新部分的处理
const pullUpRefresh = async (hot: boolean) => {
  changePullUpLoading(true)

  if (hot) {
    await refreshMoreHotSingerList()
  } else {
    await refreshMoreSingerList()
  }
}

// 顶部下拉刷新
const pullDownRefresh = async (category: string, alpha: string) => {
  changePullDownLoading(true)
  changeListOffset(0)

  if (category === '' && alpha === '') {
    await getHotSingerList()
  } else {
    await getSingerList()
  }
}

onMounted(async () => {
  if (!singerList.value.length && !category.value && !alpha.value) {
    await getHotSinger()
  }

  await nextTick()
  scrollRef.value.refresh()
})

const enterDetail = (id: string) => {
  router.push(`/singers/${id}`)
}

const handlePullUp = async () => {
  await pullUpRefresh(category.value === '')
}

const handlePullDown = async () => {
  await pullDownRefresh(category.value, alpha.value)
}

const handleUpdateCategory = async (newVal: string) => {
  if (category.value === newVal) return
  await updateCategory(newVal)

  scrollRef.value.refresh()
}

const handleUpdateAlpha = async (newVal: string) => {
  if (alpha.value === newVal) return

  await updateAlpha(newVal)
  scrollRef.value.refresh()
}
</script>

<template>
  <div>
    <div class="nav-container">
      <Horizen
        :title="'分类(默认热门):'"
        :list="categoryTypes"
        :oldVal="category"
        @handleClick="handleUpdateCategory"
      ></Horizen>
      <Horizen
        :title="'首字母:'"
        :list="alphaTypes"
        :oldVal="alpha"
        @handleClick="handleUpdateAlpha"
      ></Horizen>
    </div>
    <div
      class="list-container"
      :style="{ bottom: playList.length ? '60px' : '0' }"
    >
      <Scroll
        ref="scrollRef"
        :pullUp="true"
        :pullDown="true"
        :pullUpLoading="pullUpLoading"
        :pullDownLoading="pullDownLoading"
        @handlePullUp="handlePullUp"
        @handlePullDown="handlePullDown"
      >
        <div class="list">
          <div
            v-for="(item, index) in singerList"
            class="list-item"
            :key="`${item.accountId} ${index}`"
            @click="enterDetail(item.id)"
          >
            <div class="img-wrapper">
              <img
                v-lazy="{
                  src: `${item.picUrl}?param=300x300`,
                  loading: loadingImgUrl,
                }"
                width="100%"
                height="100%"
                alt="music"
              />
            </div>
            <span class="name">{{ item.name }}</span>
          </div>
        </div>
      </Scroll>
    </div>
    <EnterLoading v-if="enterLoading">
      <Loading></Loading>
    </EnterLoading>
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.nav-container {
  box-sizing: border-box;
  position: fixed;
  top: 95px;
  width: 100%;
  padding: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.list-container {
  position: fixed;
  top: 160px;
  left: 0;
  /* bottom: ${(props: { play?: any }) => (props.play ? '60px' : 0)}; */
  overflow: hidden;
  width: 100%;
}

.list {
  display: flex;
  margin: auto;
  flex-direction: column;
  overflow: hidden;

  .title {
    margin: 10px 0 10px 10px;
    /* color: ${style['font-color-desc']}; */
    color: var(--font-color-desc);
    /* font-size: ${style['font-size-s']}; */
    font-size: var(--font-size-s);
  }
}

.list-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  margin: 0 5px;
  padding: 5px 0;
  align-items: center;
  /* border-bottom: 1px solid ${style['border-color']}; */
  border-bottom: 1px solid var(--border-color);

  .img-wrapper {
    margin-right: 20px;

    img {
      border-radius: 3px;
      width: 50px;
      height: 50px;
    }
  }

  .name {
    /* font-size: ${style['font-size-m']}; */
    font-size: var(--font-size-m);
    /* color: ${style['font-color-desc']}; */
    color: var(--font-color-desc);
    font-weight: 500;
  }
}
</style>
