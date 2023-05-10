<script setup lang="ts">
import { list, playMode } from '@/api/config'
import { formatPlayTime, getName, prefixStyle } from '@/api/utils'
import ProgressBar from '@/baseUI/progress-bar/index.vue'
import Scroll from '@/baseUI/scroll/index.vue'
import animations from 'create-keyframe-animation'
import { ref, toRefs, defineProps, defineEmits, watch } from 'vue'

const props = defineProps<{
  full: boolean
  song: any
  mode: number
  playing: boolean
  percent: number
  currentTime: number
  duration: number
  currentLineNum: number
  currentPlayingLyric: string
  currentLyric: any
  speed: number
}>()

const {
  full,
  song,
  mode,
  playing,
  percent,
  currentTime,
  duration,
  currentLineNum,
  currentPlayingLyric,
  currentLyric,
  speed,
} = toRefs(props)

const emit = defineEmits([
  'changeMode',
  'handlePrev',
  'handleNext',
  'onProgressChange',
  'clickPlaying',
  'toggleFullScreenDispatch',
  'togglePlayListDispatch',
  'clickSpeed',
])

//处理transform的浏览器兼容问题
const transform = prefixStyle('transform')

const normalPlayerRef = ref()
const lyricScrollRef = ref()

const lyricLineRefs = ref([])
// const cdWrapperRef = ref()
const currentState = ref()

watch(
  currentLineNum,
  () => {
    if (!lyricScrollRef.value.current) return
    const bScroll = lyricScrollRef.value.getBScroll()

    if (currentLineNum.value > 5) {
      const lineEl = lyricLineRefs.value[currentLineNum.value - 5]
      bScroll.scrollToElement(lineEl, 1000)
    } else {
      bScroll.scrollTo(0, 0, 1000)
    }
  },
  {
    immediate: true,
    deep: true,
  }
)

const getPlayMode = () => {
  let content
  if (mode.value === playMode.sequence) {
    content = '&#xe625;'
  } else if (mode.value === playMode.loop) {
    content = '&#xe653;'
  } else {
    content = '&#xe61b;'
  }
  return content
}

const _getPosAndScale = () => {
  const targetWidth = 40
  const paddingLeft = 40
  const paddingBottom = 30
  const paddingTop = 80
  const width = window.innerWidth * 0.8
  const scale = targetWidth / width

  // 两个圆心的横坐标距离和纵坐标距离
  const x = -(window.innerWidth / 2 - paddingLeft)
  const y = window.innerHeight - paddingTop - width / 2 - paddingBottom

  return {
    x,
    y,
    scale,
  }
}

const beforeEnter = async (el: any) => {
  normalPlayerRef.value.style.display = 'block'
  const { x, y, scale } = _getPosAndScale()

  const animation = {
    0: {
      transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
    },
    60: {
      transform: `translate3d(0, 0, 0) scale(1.1)`,
    },
    100: {
      transform: `translate3d(0, 0, 0) scale(1)`,
    },
  }
  animations.registerAnimation({
    name: 'move',
    animation,
    presets: {
      duration: 400,
      easing: 'linear',
    },
  })

  animations.runAnimation(el.querySelector('.middle'), 'move')
}

const afterEnter = (el: any) => {
  animations.unregisterAnimation('move')
  el.querySelector('.middle').style.animation = ''
}

const beforeLeave = (el: any) => {
  el.querySelector('.middle').style.transition = 'all 0.4s'

  const { x, y, scale } = _getPosAndScale()

  el.querySelector('.middle').style[
    transform
  ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
}

const afterLeave = (el: any) => {
  el.querySelector('.middle').style.transition = ''
  el.querySelector('.middle').style[transform] = ''

  el.style.display = 'none'

  currentState.value = ''
}

const toggleCurrentState = () => {
  let nextState = ''

  if (currentState.value !== 'lyric') {
    nextState = 'lyric'
  } else {
    nextState = ''
  }

  currentState.value = nextState
}

const clickPlayingCB = (e: any) => {
  emit('clickPlaying', e, !playing.value)
}

const percentChange = (value: number) => {
  emit('onProgressChange', value)
}
</script>

<template>
  <Transition
    name="normal"
    :duration="400"
    @beforeEnter="beforeEnter"
    @afterEnter="afterEnter"
    @beforeLeave="beforeLeave"
    @afterLeave="afterLeave"
  >
    <div class="normal-player-container" ref="normalPlayerRef" v-if="full">
      <div class="background">
        <img
          :src="song.al.picUrl + '?param=300x300'"
          width="100%"
          height="100%"
          alt="歌曲图片"
        />
      </div>
      <div class="background layer"></div>
      <div class="top">
        <div class="back" @click="emit('toggleFullScreenDispatch', false)">
          <i class="iconfont icon-back">&#xe662;</i>
        </div>
        <div class="text">
          <h1 class="title">{{ song.name }}</h1>
          <h1 class="subtitle">{{ getName(song.ar) }}</h1>
        </div>
      </div>
      <div class="middle" ref="cdWrapperRef" @click="toggleCurrentState">
        <Transition :duration="400" name="fade">
          <div
            class="cd-wrapper"
            v-if="currentState !== 'lyric'"
            :style="{
              visibility: currentState !== 'lyric' ? 'visible' : 'hidden',
            }"
          >
            <div :class="`needle ${playing ? '' : 'pause'}`"></div>
            <div class="cd">
              <img
                :class="`image play ${playing ? '' : 'pause'}`"
                :src="song.al.picUrl + '?param=400x400'"
                alt=""
              />
            </div>
            <p class="playing-lyric">{{ currentPlayingLyric }}</p>
          </div>
        </Transition>
        <Transition :duration="400" name="fade">
          <div class="lyric-container" v-if="currentState === 'lyric'">
            <Scroll ref="lyricScrollRef">
              <div
                class="lyric-wrapper"
                :style="{
                  visibility: currentState === 'lyric' ? 'visible' : 'hidden',
                }"
              >
                <template v-if="currentLyric">
                  <p
                    v-for="(item, index) in currentLyric.lines"
                    :class="`text ${currentLineNum === index ? 'current' : ''}`"
                    :key="item + index"
                    ref="lyricLineRefs"
                  >
                    {{ item.txt }}
                  </p>
                </template>
                <template v-else>
                  <p class="text pure">纯音乐，请欣赏。</p>
                </template>
              </div>
            </Scroll>
          </div>
        </Transition>
      </div>
      <Bottom class="bottom">
        <List>
          <span>倍速听歌</span>
          {list.map(item => { return (
          <div
            class="list-item"
            v-for="item in list"
            :key="item.key"
            :class="`${speed === item.key ? 'selected' : ''}`"
            @click="emit('clickSpeed', item.key)"
          >
            {{ item.name }}
          </div>
          ) })}
        </List>
        <ProgressWrapper>
          <span class="time time-l">{{ formatPlayTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <ProgressBar
              :percent="percent"
              @percentChange="percentChange"
            ></ProgressBar>
          </div>
          <div class="time time-r">{{ formatPlayTime(duration) }}</div>
        </ProgressWrapper>
        <div class="operators">
          <div class="icon i-left" @click="emit('changeMode')">
            <i class="iconfont" v-html="getPlayMode()"></i>
          </div>
          <div class="icon i-left" @click="emit('handlePrev')">
            <i class="iconfont">&#xe6e1;</i>
          </div>
          <div class="icon i-center">
            <i
              class="iconfont"
              @click="
                {
                  clickPlayingCB
                }
              "
              v-html="playing ? '&#xe723;' : '&#xe731;'"
            ></i>
          </div>
          <div class="icon i-right" @click="emit('handleNext')">
            <i class="iconfont">&#xe718;</i>
          </div>
          <div
            class="icon i-right"
            @click="emit('togglePlayListDispatch', true)"
          >
            <i class="iconfont">&#xe640;</i>
          </div>
        </div>
      </Bottom>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.normal-player-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  /* background: ${style['background-color']}; */
  background: var(--background-color);

  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);

    &.layer {
      /* background: ${style['font-color-desc']}; */
      background: var(--font-color-desc);
      opacity: 0.3;
      filter: none;
    }
  }

  &.normal-enter,
  &.normal-exit-done {
    .top {
      transform: translate3d(0, -100px, 0);
    }

    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }

  &.normal-enter-active,
  &.normal-exit-active {
    .top,
    .bottom {
      transform: translate3d(0, 0, 0);
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }

    opacity: 1;
    transition: all 0.4s;
  }

  &.normal-exit-active {
    opacity: 0;
  }
}

.top {
  box-sizing: border-box;
  position: absolute;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  /* border-bottom: 1px solid ${style['border-color-v2']}; */
  border-bottom: 1px solid var(--border-color-v2);
  padding-bottom: 5px;
  width: 100%;
  height: 8%;

  .back {
    margin-left: 5px;
    z-index: 50;

    .iconfont {
      display: block;
      padding: 9px;
      font-size: 24px;
      /* color: ${style['font-color-desc']}; */
      color: var(--font-color-desc);
      font-weight: bold;
      transform: rotate(90deg);
    }
  }

  .text {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  .title {
    line-height: 25px;
    /* font-size: ${style['font-size-l']}; */
    font-size: var(--font-size-l);
    /* color: ${style['font-color-desc']}; */
    color: var(--font-color-desc);
    /* ${style.noWrap()}; */
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .subtitle {
    line-height: 20px;
    /* font-size: ${style['font-size-m']}; */
    font-size: var(--font-size-m);
    /* color: ${style['font-color-desc-v2']}; */
    color: var(--font-color-desc-v2);
    /* ${style.noWrap()}; */
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.middle {
  position: fixed;
  width: 100%;
  top: 8%;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
  overflow: hidden;

  .fade-enter {
    opacity: 0;
  }

  .fade-enter-active {
    opacity: 1;
    transition: all 0.4s;
  }

  .fade-enter-done {
    transition: none;
  }

  .fade-exit-active {
    opacity: 0;
  }

  .fade-exit-done {
    opacity: 0;
  }
}

.cd-wrapper {
  margin: auto;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  box-sizing: border-box;

  .needle {
    position: absolute;
    top: -6.67vw;
    left: 48vw;
    width: 25vw;
    height: 40vw;
    z-index: 100;
    /* background-image: url(${needle}); */
    /* ${style.bgFull()}; */
    background-position: 50%;
    background-size: contain;
    background-repeat: no-repeat;
    transform-origin: 4.5vw 4.5vw;
    transition: all 0.3s;
    transform: rotate(0);

    &.pause {
      transform: rotate(-30deg);
    }
  }

  .cd {
    top: 16%;
    position: absolute;
    width: 70%;
    height: 70vw;
    /* background-image: url(${disc}); */
    /* border: 4px solid ${style['border-color-v2']}; */
    border: 4px solid var(--border-color-v2);
    border-radius: 50%;
    /* ${style.bgFull()}; */
    background-position: 50%;
    background-size: contain;
    background-repeat: no-repeat;

    .image {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 68%;
      height: 68%;
      margin: auto;
      border-radius: 50%;
    }

    .play {
      animation: rotate 20s linear infinite;

      &.pause {
        animation-play-state: paused;
      }
    }
  }

  .playing-lyric {
    position: absolute;
    margin: auto;
    width: 80%;
    top: 95vw;
    font-size: 14px;
    line-height: 20px;
    white-space: normal;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
  }
}

.lyric-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  /* 遮罩 会有模糊效果，看个人喜欢 */
  /* mask-image: -webkit-gradient(linear,left top,left bottom,color-stop(0,hsla(0,0%,100%,0)),color-stop(10%,hsla(0,0%,100%,.6)),color-stop(25%,#fff),color-stop(75%,#fff),color-stop(85%,hsla(0,0%,100%,.6)),to(hsla(0,0%,100%,0)));
  mask-image: linear-gradient(linear,left top,left bottom,color-stop(0,hsla(0,0%,100%,0)),color-stop(10%,hsla(0,0%,100%,.6)),color-stop(25%,#fff),color-stop(75%,#fff),color-stop(85%,hsla(0,0%,100%,.6)),to(hsla(0,0%,100%,0))); */
}

.lyric-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  text-align: center;

  p {
    line-height: 32px;
    color: rgba(255, 255, 255, 0.5);
    white-space: normal;
    /* font-size: ${style['font-size-l']}; */
    font-size: var(--font-size-l);

    &.current {
      color: #fff;
    }

    &.pure {
      position: relative;
      top: 30vh;
    }
  }
}

.bottom {
  position: absolute;
  bottom: 50px;
  width: 100%;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  padding: 10px 0;

  .time {
    /* color: ${style['font-color-desc']}; */
    color: var(--font-color-desc);
    /* font-size: ${style['font-size-s']}; */
    font-size: var(--font-size-s);
    flex: 0 0 30px;
    line-height: 30px;
    width: 30px;

    &.time-l {
      text-align: left;
    }

    &.time-r {
      text-align: right;
    }
  }

  .progress-bar-wrapper {
    flex: 1;
  }
}

.operators {
  display: flex;
  align-items: center;

  .icon {
    font-weight: 300;
    flex: 1;
    /* color: ${style['font-color-desc']}; */
    color: var(--font-color-desc);

    &.disable {
      /* color: ${style['theme-color-shadow']}; */
      color: var(--theme-color-shadow);
    }

    i {
      font-weight: 300;
      font-size: 30px;
    }
  }

  .i-left {
    text-align: right;
  }

  .i-center {
    padding: 0 20px;
    text-align: center;

    i {
      font-size: 40px;
    }
  }

  .i-right {
    text-align: left;
  }

  .icon-favorite {
    /* color: ${style['theme-color']}; */
    color: var(--theme-color);
  }
}

.list {
  width: 70%;
  margin: auto;
  display: flex;
  align-items: center;
  height: 30px;
  justify-content: space-around;
  overflow: hidden;

  > span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    /* color: ${style['font-color-desc-v2']}; */
    color: var(--font-color-desc-v2);
    /* font-size: ${style['font-size-m']}; */
    font-size: var(--font-size-m);
    /* vertical-align: middle; */
  }
}

.list-item {
  flex: 0 0 auto;
  /* font-size: ${style['font-size-m']}; */
  font-size: var(--font-size-m);
  padding: 5px;
  border-radius: 10px;
  /* color: ${style['font-color-desc-v2']}; */
  color: var(--font-color-desc-v2);

  &.selected {
    /* color: ${style['theme-color']}; */
    color: var(--theme-color);
    /* border: 1px solid ${style['theme-color']}; */
    border: 1px solid var(--theme-color);
    opacity: 0.8;
  }
}
</style>
