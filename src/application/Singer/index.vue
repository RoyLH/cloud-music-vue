<script setup lang="ts">
import { HEADER_HEIGHT } from '@/api/config'
import SongsList from '@/application/SongList/index.vue'
import EnterLoading from '@/baseUI/enter-loading/index.vue'
import Header from '@/baseUI/header/index.vue'
import Loading from '@/baseUI/loading/index.vue'
import MusicNote from '@/baseUI/music-note/index.vue'
import Scroll from '@/baseUI/scroll/index.vue'
import { usePlayerStore } from '@/stores/player'
import { useSingerStore } from '@/stores/singer'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const initialHeight = ref(0)
const showStatus = ref(true)

const router = useRouter()

const {
  params: { id },
} = useRoute()

const OFFSET = 5

const { artist, songsOfArtist, loading } = storeToRefs(useSingerStore())

const { changeEnterLoading, getSingerInfo } = useSingerStore()

const { playList } = storeToRefs(usePlayerStore())

const collectButtonRef = ref()
const imageWrapperRef = ref()
const songScrollWrapperRef = ref()
const songScrollRef = ref()
const headerRef = ref()
const layerRef = ref()
const musicNoteRef = ref()

onMounted(async () => {
  changeEnterLoading(true)
  await getSingerInfo(id as string)

  const h = imageWrapperRef.value.offsetHeight
  console.log(h)
  initialHeight.value = h

  songScrollWrapperRef.value.style.top = `${h - OFFSET}px`

  // 把遮罩先放在下面，以裹住歌曲列表
  layerRef.value.style.top = `${h - OFFSET}px`

  songScrollRef.value.refresh()
})

const handleScroll = (pos: any) => {
  const newY = pos.y

  const minScrollY = -(initialHeight.value - OFFSET) + HEADER_HEIGHT

  const percent = Math.abs(newY / initialHeight.value)

  // 说明: 在歌手页的布局中，歌单列表其实是没有自己的背景的，layerDOM其实是起一个遮罩的作用，给歌单内容提供白色背景
  // 因此在处理的过程中，随着内容的滚动，遮罩也跟着移动
  if (newY > 0) {
    // 处理往下拉的情况,效果：图片放大，按钮跟着偏移
    imageWrapperRef.value.style['transform'] = `scale(${1 + percent})`
    collectButtonRef.value.style['transform'] = `translate3d(0, ${newY}px, 0)`
    layerRef.value.style.top = `${initialHeight.value - OFFSET + newY}px`
  } else if (newY >= minScrollY) {
    // 往上滑动，但是还没超过Header部分
    layerRef.value.style.top = `${
      initialHeight.value - OFFSET - Math.abs(newY)
    }px`
    layerRef.value.style.zIndex = 1
    imageWrapperRef.value.style.paddingTop = '75%'
    imageWrapperRef.value.style.height = 0
    imageWrapperRef.value.style.zIndex = -1
    collectButtonRef.value.style['transform'] = `translate3d(0, ${newY}px, 0)`
    collectButtonRef.value.style['opacity'] = `${1 - percent * 2}`
  } else if (newY < minScrollY) {
    // 往上滑动，但是超过Header部分
    layerRef.value.style.top = `${HEADER_HEIGHT - OFFSET}px`
    layerRef.value.style.zIndex = 1
    // 防止溢出的歌单内容遮住Header
    headerRef.value.$el.style.zIndex = 100
    // 此时图片高度与Header一致
    imageWrapperRef.value.style.height = `${HEADER_HEIGHT}px`
    imageWrapperRef.value.style.paddingTop = 0
    imageWrapperRef.value.style.zIndex = 99
  }
}

const musicAnimation = (x: number, y: number) => {
  musicNoteRef.value.startAnimation({ x, y })
}
</script>

<template>
  <Transition :duration="300" name="fly" appear @afterLeave="router.back()">
    <div v-if="showStatus" class="container" :style="{ bottom: 0 }">
      <Header
        ref="headerRef"
        :title="artist.name"
        @handleClick="showStatus = false"
      ></Header>
      <div
        class="img-wrapper"
        ref="imageWrapperRef"
        :style="{
          backgroundImage: `url(${artist.picUrl})`,
        }"
      >
        <div class="filter"></div>
      </div>
      <div ref="collectButtonRef" class="collect-button">
        <i class="iconfont">&#xe62d;</i>
        <span class="text">收藏</span>
      </div>
      <div ref="layerRef" class="bg-layer"></div>
      <div
        ref="songScrollWrapperRef"
        class="song-list-wrapper"
        :style="{
          bottom: playList.length > 0 ? '60px' : '0',
        }"
      >
        <Scroll ref="songScrollRef" :scroll="true" @handleScroll="handleScroll">
          <SongsList
            :songs="songsOfArtist"
            :showCollect="false"
            :usePageSplit="false"
            @musicAnimation="musicAnimation"
          ></SongsList>
        </Scroll>
      </div>
      <EnterLoading v-if="loading" :style="{ zIndex: 100 }">
        <Loading></Loading>
      </EnterLoading>
      <MusicNote ref="musicNoteRef"></MusicNote>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* bottom: ${(props: { play?: any }) => (props.play > 0 ? '60px' : 0)}; */
  width: 100%;
  z-index: 100;
  overflow: hidden;
  background: #f2f3f4;
  transform-origin: right bottom;

  &.fly-enter-from {
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }

  &.fly-enter-active {
    transition: transform 0.3s;
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }

  &.fly-leave-from {
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }

  &.fly-leave-active {
    transition: transform 0.3s;
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }
}

.img-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 75%;
  transform-origin: top;
  /* background: url(${(props: {bgUrl: any})=>props.bgUrl}); */
  background-size: cover;
  z-index: 50;

  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* : blur(20px); */
    background: rgba(7, 17, 27, 0.3);
  }
}

.collect-button {
  position: fixed;
  left: 0;
  right: 0;
  margin: auto;
  box-sizing: border-box;
  width: 120px;
  height: 40px;
  margin-top: -55px;
  z-index: 50;
  /* background: ${style['theme-color']}; */
  background: var(--theme-color);
  /* color: ${style['font-color-light']}; */
  color: var(--font-color-light);
  border-radius: 20px;
  text-align: center;
  font-size: 0;
  line-height: 40px;

  .iconfont {
    display: inline-block;
    margin-right: 10px;
    font-size: 12px;
    vertical-align: 1px;
  }

  .text {
    display: inline-block;
    font-size: 14px;
    letter-spacing: 5px;
  }
}

.song-list-wrapper {
  position: absolute;
  z-index: 50;
  top: 0;
  left: 0;
  /* bottom: ${(props: { play?: any }) => (props.play > 0 ? '60px' : 0)}; */
  right: 0;

  > div {
    position: absolute;
    left: 0;
    width: 100%;
    overflow: visible;
  }
}

.bg-layer {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: white;
  border-radius: 10px;
  z-index: 50;
}
</style>
