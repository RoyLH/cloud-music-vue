<script setup lang="ts">
import { playMode } from '@/api/config'
import { findIndex, getName, prefixStyle, shuffle } from '@/api/utils'
import Confirm from '@/baseUI/confirm/index.vue'
import Scroll from '@/baseUI/scroll/index.vue'
import { ref, defineEmits } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { storeToRefs } from 'pinia'

const isShow = ref(false)
const canTouch = ref(true)
const startY = ref(0)
const initialed = ref<any>(0)
const distance = ref(0)

const transform = prefixStyle('transform')

const listContentRef = ref()
const listWrapperRef = ref()
const playListRef = ref()
const confirmRef = ref()

const {
  currentIndex,
  currentSong,
  showPlayList,
  playList,
  mode,
  sequencePlayList,
} = storeToRefs(usePlayerStore())

const emit = defineEmits(['clearPreSong'])

const {
  changeShowPlayList,
  changeCurrentIndex,
  changePlayMode,
  changePlayList,
  deleteSong,
  changeSequencePlayList,
  changeCurrentSong,
  changePlayingState,
} = usePlayerStore()

const changeMode = () => {
  const newMode = (mode.value + 1) % 3

  if (newMode === 0) {
    changePlayList(sequencePlayList.value)

    const index = findIndex(currentSong, sequencePlayList.value)
    changeCurrentIndex(index)
  } else if (newMode === 1) {
    changePlayList(sequencePlayList.value)
  } else if (newMode === 2) {
    const newList = shuffle(sequencePlayList.value)
    const index = findIndex(currentSong.value, newList)

    changePlayList(newList)
    changeCurrentIndex(index)
  }

  changePlayMode(newMode)
}

const handleChangeCurrentIndex = (index: number) => {
  if (currentIndex.value === index) return
  changeCurrentIndex(index)
}

const handleScroll = (pos: any) => {
  const state = pos.y === 0
  canTouch.value = state
}

const handleTouchStart = (e: any) => {
  if (!canTouch.value || initialed) return

  listWrapperRef.value!.style['transition'] = ''
  distance.value = 0
  startY.value = e.nativeEvent.touches[0].pageY
  initialed.value = true
}

const handleTouchMove = (e: any) => {
  if (!canTouch.value || !initialed.value) return
  if (e.nativeEvent.touches[0].pageY - startY.value < 0) return

  distance.value = e.nativeEvent.touches[0].pageY - startY.value
  listWrapperRef.value.current.style.transform = `translate3d(0, ${distance.value}px, 0)`
}

const handleTouchEnd = () => {
  initialed.value = false

  if (distance.value >= 150) {
    changeShowPlayList(false)
  } else {
    listWrapperRef.value.style['transition'] = 'all 0.3s'
    listWrapperRef.value.style[transform] = `translate3d(0px, 0px, 0px)`
  }
}

const handleDeleteSong = (song: any) => {
  deleteSong(song)
}

const handleShowClear = () => {
  confirmRef.value.show()
}

const handleConfirmClear = () => {
  changePlayList([])
  changeSequencePlayList([])
  changeCurrentIndex(-1)
  changeShowPlayList(false)
  changeCurrentSong({})
  changePlayingState(false)

  // 修复清空播放列表后点击同样的歌曲，播放器不出现的bug
  emit('clearPreSong')
}

const getPlayMode = () => {
  let content, text
  if (mode.value === playMode.sequence) {
    content = '&#xe625;'
    text = '顺序播放'
  } else if (mode.value === playMode.loop) {
    content = '&#xe653;'
    text = '单曲循环'
  } else {
    content = '&#xe61b;'
    text = '随机播放'
  }

  return {
    content,
    text,
  }
}

const beforeEnter = () => {
  isShow.value = true
  listWrapperRef.value.style[transform] = `translate3d(0, 100%, 0)`
}

const enter = () => {
  listWrapperRef.value.style['transition'] = 'all 0.3s'
  listWrapperRef.value.style[transform] = `translate3d(0, 0, 0)`
}

const beforeLeave = () => {
  listWrapperRef.value.style[
    transform
  ] = `translate3d(0, ${distance.value}px, 0)`
}

const leave = () => {
  listWrapperRef.value.style['transition'] = 'all 0.3s'
  listWrapperRef.value.style[transform] = `translate3d(0px, 100%, 0px)`
}

const afterLeave = () => {
  isShow.value = false
  listWrapperRef.value.style[transform] = `translate3d(0px, 100%, 0px)`
}
</script>

<template>
  <Transition
    :duration="300"
    name="list-fade"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @beforeLeave="beforeLeave"
    @leave="leave"
    @afterLeave="afterLeave"
  >
    <div
      class="play-list-wrapper"
      v-if="showPlayList"
      ref="playListRef"
      :style="{ display: isShow === true ? 'block' : 'none' }"
      @click="changeShowPlayList(false)"
    >
      <div
        class="list-wrapper"
        ref="listWrapperRef"
        @click.stop
        @onTouchStart="handleTouchStart"
        @onTouchMove="handleTouchMove"
        @onTouchEnd="handleTouchEnd"
      >
        <div class="list-header">
          <h1 class="title">
            <div>
              <i
                class="iconfont"
                @click="changeMode"
                v-html="getPlayMode().content"
              ></i>
              <span class="text" @click="changeMode">
                {{ getPlayMode().text }}
              </span>
            </div>
            <span class="iconfont clear" @click="handleShowClear">
              &#xe63d;
            </span>
          </h1>
        </div>
        <div class="scroll-wrapper">
          <Scroll
            ref="listContentRef"
            :scroll="true"
            :bounceTop="false"
            @handleScroll="handleScroll"
          >
            <div class="list-content">
              <li
                v-for="(item, index) in playList"
                class="item"
                :key="item.id"
                @click="handleChangeCurrentIndex(index)"
              >
                <i
                  :class="`current iconfont ${
                    currentSong.id === item.id ? 'icon-play' : ''
                  }`"
                  v-html="currentSong.id === item.id ? '&#xe6e3;' : ''"
                ></i>
                <span class="text">
                  {{ item.name }} - {{ getName(item.ar) }}
                </span>
                <span class="like">
                  return <i class="iconfont">&#xe601;</i>
                </span>
                <span class="delete" @click.stop="handleDeleteSong(item)">
                  <i class="iconfont">&#xe63d;</i>
                </span>
              </li>
            </div>
          </Scroll>
        </div>
      </div>
      <Confirm
        :ref="confirmRef"
        :text="'是否删除全部?'"
        :cancelBtnText="'取消'"
        :confirmBtnText="'确定'"
        @handleConfirm="handleConfirmClear"
      ></Confirm>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.play-list-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  /* background-color: ${style['background-color-shadow']}; */
  background-color: var(--background-color-shadow);

  &.list-fade-enter {
    opacity: 0;
  }

  &.list-fade-enter-active {
    opacity: 1;
    transition: all 0.3s;
  }

  &.list-fade-exit {
    opacity: 1;
  }

  &.list-fade-exit-active {
    opacity: 0;
    transition: all 0.3s;
  }

  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    opacity: 1;
    border-radius: 10px 10px 0 0;
    /* background-color: ${style['highlight-background-color']}; */
    background-color: var(--highlight-background-color);
    transform: translate3d(0, 0, 0);

    .list-close {
      text-align: center;
      line-height: 50px;
      /* background: ${style['background-color']}; */
      background: var(--background-color);
      /* font-size: ${style['font-size-l']}; */
      font-size: var(--font-size-l);
      /* color: ${style['font-color-desc']}; */
      color: var(--font-color-desc);
    }
  }
}

.list-header {
  position: relative;
  padding: 20px 30px 10px 20px;

  .title {
    display: flex;
    align-items: center;

    > div {
      flex: 1;

      .text {
        flex: 1;
        /* font-size: ${style['font-size-m']}; */
        font-size: var(--font-size-m);
        /* color: ${style['font-color-desc']}; */
        color: var(--font-color-desc);
      }
    }

    .iconfont {
      margin-right: 10px;
      /* font-size: ${style['font-size-ll']}; */
      font-size: var(--font-size-ll);
      /* color: ${style['theme-color']}; */
      color: var(--theme-color);
    }

    .clear {
      /* ${style.extendClick()} */
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: -10px;
        bottom: -10px;
        left: -10px;
        right: -10px;
      }
      /* font-size: ${style['font-size-l']}; */
      font-size: var(--font-size-l);
    }
  }
}

.scroll-wrapper {
  height: 400px;
  overflow: hidden;
}

.list-content {
  .item {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 30px 0 20px;
    overflow: hidden;

    &.list-enter,
    &.list-exit-done {
      height: 0;
    }

    &.list-enter-active,
    &.list-leave-active {
      transition: all 0.1s;
    }

    .current {
      flex: 0 0 20px;
      width: 20px;
      /* font-size: ${style['font-size-s']}; */
      font-size: var(--font-size-s);
      /* color: ${style['theme-color']}; */
      color: var(--theme-color);
    }

    .text {
      flex: 1;
      /* ${style.noWrap()} */
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      /* font-size: ${style['font-size-m']}; */
      font-size: var(--font-size-m);
      /* color: ${style['font-color-desc-v2']}; */
      color: var(--font-color-desc-v2);

      .icon-favorite {
        /* color: ${style['theme-color']}; */
        color: var(--theme-color);
      }
    }

    .like {
      /* ${style.extendClick()} */
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: -10px;
        bottom: -10px;
        left: -10px;
        right: -10px;
      }

      margin-right: 15px;
      /* font-size: ${style['font-size-m']}; */
      font-size: var(--font-size-m);
      /* color: ${style['theme-color']}; */
      color: var(--theme-color);
    }

    .delete {
      /* ${style.extendClick()} */
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: -10px;
        bottom: -10px;
        left: -10px;
        right: -10px;
      }

      /* font-size: ${style['font-size-s']}; */
      font-size: var(--font-size-s);
      /* color: ${style['theme-color']}; */
      color: var(--theme-color);
    }
  }
}
</style>
