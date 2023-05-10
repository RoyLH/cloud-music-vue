<script setup lang="ts">
import { HEADER_HEIGHT } from '@/api/config'
import SongsList from '@/application/SongList/index.vue'
import EnterLoading from '@/baseUI/enter-loading/index.vue'
import Header from '@/baseUI/header/index.vue'
import Loading from '@/baseUI/loading/index.vue'
import MusicNote from '@/baseUI/music-note/index.vue'
import Scroll from '@/baseUI/scroll/index.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSingerStore } from '@/stores/singer'
import { usePlayerStore } from '@/stores/player'

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

  const h = imageWrapperRef.value?.offsetHeight
  initialHeight.value = h
  songScrollWrapperRef.value.style.top = `${h - OFFSET}px`

  //把遮罩先放在下面，以裹住歌曲列表
  layerRef.value.style.top = `${h - OFFSET}px`
  songScrollRef.value.refresh()
})

const handleScroll = (pos: any) => {
  const height = initialHeight.value!
  const newY = pos.y
  const imageDOM = imageWrapperRef.value!
  const buttonDOM = collectButtonRef.value!
  const headerDOM = headerRef.value!
  const layerDOM = layerRef.value!
  const minScrollY = -(height - OFFSET) + HEADER_HEIGHT

  const percent = Math.abs(newY / height)

  // 说明: 在歌手页的布局中，歌单列表其实是没有自己的背景的，layerDOM其实是起一个遮罩的作用，给歌单内容提供白色背景
  // 因此在处理的过程中，随着内容的滚动，遮罩也跟着移动
  if (newY > 0) {
    // 处理往下拉的情况,效果：图片放大，按钮跟着偏移
    imageDOM.style['transform'] = `scale(${1 + percent})`
    buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`
    layerDOM.style.top = `${height - OFFSET + newY}px`
  } else if (newY >= minScrollY) {
    // 往上滑动，但是还没超过Header部分
    layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`
    layerDOM.style.zIndex = 1
    imageDOM.style.paddingTop = '75%'
    imageDOM.style.height = 0
    imageDOM.style.zIndex = -1
    buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`
    buttonDOM.style['opacity'] = `${1 - percent * 2}`
  } else if (newY < minScrollY) {
    // 往上滑动，但是超过Header部分
    layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`
    layerDOM.style.zIndex = 1
    // 防止溢出的歌单内容遮住Header
    headerDOM.style.zIndex = 100
    // 此时图片高度与Header一致
    imageDOM.style.height = `${HEADER_HEIGHT}px`
    imageDOM.style.paddingTop = 0
    imageDOM.style.zIndex = 99
  }
}

const musicAnimation = (x: number, y: number) => {
  musicNoteRef.value.startAnimation({ x, y })
}
</script>

<template>
  <Transition :duration="300" name="fly" appear @afterLeave="router.back">
    <div class="container" v-if="showStatus">
      <Header
        ref="headerRef"
        :title="artist.name"
        @handleClick="showStatus = false"
      ></Header>
      <div
        class="img-wrapper"
        ref="imageWrapperRef"
        :style="{
          background: `url(${artist.picUrl})`,
        }"
      >
        <div class="filter"></div>
      </div>
      <div class="collect-button" ref="collectButtonRef">
        <i class="iconfont">&#xe62d;</i>
        <span class="text">收藏</span>
      </div>
      <div class="bg-layer" ref="layerRef"></div>
      <div
        class="song-list-wrapper"
        ref="songScrollWrapperRef"
        :style="{
          bottom: playList.length > 0 ? '60px' : '0',
        }"
      >
        <Scroll :scroll="true" ref="songScrollRef" @handleScoll="handleScroll">
          <SongsList
            :songs="songsOfArtist"
            :showCollect="false"
            :usePageSplit="false"
            @musicAnimation="musicAnimation"
          ></SongsList>
        </Scroll>
      </div>
      <EnterLoading :style="{ zIndex: 100 }" v-if="loading">
        <Loading></Loading>
      </EnterLoading>
      <MusicNote ref="{musicNoteRef}"></MusicNote>
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

  &.fly-enter,
  &.fly-appear {
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }

  &.fly-enter-active,
  &.fly-appear-active {
    transition: transform 0.3s;
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }

  &.fly-exit {
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }

  &.fly-exit-active {
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
