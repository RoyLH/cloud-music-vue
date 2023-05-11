<script setup lang="ts">
import { getName } from '@/api/utils'
import ProgressCircle from '@/baseUI/progress-circle/index.vue'
import { defineEmits, defineProps, ref, toRefs } from 'vue'

const props = defineProps<{
  full: boolean
  song: any
  playing: boolean
  percent: number
}>()

const { full, song, playing, percent } = toRefs(props)

defineEmits(['clickPlaying', 'setFullScreen', 'togglePlayList'])

const miniPlayerRef = ref()
const miniWrapperRef = ref()
const miniImageRef = ref()

const beforeEnter = (el: any) => {
  el.style.display = 'flex'
}

const afterLeave = (el: any) => {
  el.style.display = 'none'
}
</script>

<template>
  <Transition
    name="mini"
    :duration="400"
    @beforeEnter="beforeEnter"
    @afterLeave="afterLeave"
  >
    <div
      class="mini-player-container"
      v-if="!full"
      ref="miniPlayerRef"
      @click="$emit('setFullScreen', true)"
    >
      <div class="icon">
        <div ref="miniWrapperRef" class="img-wrapper">
          <img
            ref="miniImageRef"
            :class="`play ${playing ? '' : 'pause'}`"
            :src="song.al.picUrl"
            width="40"
            height="40"
            alt="img"
          />
        </div>
      </div>
      <div class="text">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getName(song.ar) }}</p>
      </div>
      <div class="control">
        <ProgressCircle :radius="32" :percent="percent">
          <template v-if="playing">
            <i
              class="icon-mini iconfont icon-pause"
              @click.stop="$emit('clickPlaying', $event, false)"
            >
              &#xe650;
            </i>
          </template>
          <template v-else>
            <i
              class="icon-mini iconfont icon-play"
              @click.stop="$emit('clickPlaying', $event, true)"
            >
              &#xe61e;
            </i>
          </template>
        </ProgressCircle>
      </div>
      <div class="control" @click.stop="$emit('clickPlaying', true)">
        <i class="iconfont">&#xe640;</i>
      </div>
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

.mini-player-container {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 60px;
  /* background: ${style['highlight-background-color']}; */
  background: var(--highlight-background-color);

  &.mini-enter {
    transform: translate3d(0, 100%, 0);
  }

  &.mini-enter-active {
    transform: translate3d(0, 0, 0);
    transition: all 0.4s;
  }

  &.mini-leave-active {
    transform: translate3d(0, 100%, 0);
    transition: all 0.4s;
  }

  .icon {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;

    .img-wrapper {
      width: 100%;
      height: 100%;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s infinite;

          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;

    .name {
      margin-bottom: 2px;
      /* font-size: ${style['font-size-m']}; */
      font-size: var(--font-size-m);
      /* color: ${style['font-color-desc']}; */
      color: var(--font-color-desc);
      /* ${style.noWrap()} */
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .desc {
      /* font-size: ${style['font-size-s']}; */
      font-size: var(--font-size-s);
      /* color: ${style['font-color-desc-v2']}; */
      color: var(--font-color-desc-v2);
      /* ${style.noWrap()} */
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .control {
    flex: 0 0 30px;
    padding: 0 10px;

    .iconfont,
    .icon-playlist {
      font-size: 30px;
      /* color: ${style['theme-color']}; */
      color: var(--theme-color);
    }

    .icon-mini {
      font-size: 16px;
      position: absolute;
      left: 8px;
      top: 8px;

      &.icon-play {
        left: 9px;
      }
    }
  }
}
</style>
