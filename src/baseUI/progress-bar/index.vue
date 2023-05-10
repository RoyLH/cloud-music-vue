<script setup lang="ts">
import { ref, toRefs, defineProps, watch, defineEmits } from 'vue'
import { prefixStyle } from '@/api/utils'

const props = defineProps<{
  percent: number
}>()

const touch = ref<any>({})

const emit = defineEmits(['percentChange'])

const progressBarRef = ref()
const progressRef = ref()
const progressBtnRef = ref()

const { percent } = toRefs(props)

const transform = prefixStyle('transform') as any

const progressBtnWidth = 16

watch(
  percent,
  percent => {
    if (percent >= 0 && percent <= 1 && !touch.value.initiated) {
      const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
      const offsetWidth = percent * barWidth

      progressRef.value.style.width = `${offsetWidth}px`
      progressBtnRef.value.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  {
    immediate: true,
    deep: true,
  }
)

const _offset = (offsetWidth: number) => {
  progressRef.value.style.width = `${offsetWidth}px`
  progressBtnRef.value.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
}

const _changePercent = () => {
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
  const curPercent = progressRef.value.clientWidth / barWidth

  emit('percentChange', curPercent)
}

const progressClick = (e: any) => {
  const rect = progressBarRef.value.getBoundingClientRect()
  const offsetWidth = e.pageX - rect.left

  _offset(offsetWidth)
  _changePercent()
}

const progressTouchStart = (e: any) => {
  const startTouch = {} as any

  startTouch.initiated = true
  startTouch.startX = e.touches[0].pageX
  startTouch.left = progressRef.value.clientWidth

  touch.value = startTouch
}

const progressTouchMove = (e: any) => {
  if (!touch.value.initiated) return
  const deltaX = e.touches[0].pageX - touch.value.startX
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
  const offsetWidth = Math.min(Math.max(0, touch.value.left + deltaX), barWidth)

  _offset(offsetWidth)
}

const progressTouchEnd = () => {
  const endTouch = JSON.parse(JSON.stringify(touch))
  endTouch.initiated = false

  touch.value = endTouch
  _changePercent()
}
</script>

<template>
  <div class="progress-bar-wrapper">
    <div class="bar-inner" ref="progressBarRef" @click="progressClick">
      <div class="progress" ref="progressRef"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtnRef"
        @touchstart="progressTouchStart"
        @touchmove="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.progress-bar-wrapper {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      /* background: ${style['theme-color']}; */
      background: var(--theme-color);
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        /* border: 3px solid ${style['border-color']}; */
        border: 3px solid var(--border-color);
        border-radius: 50%;
        /* background: ${style['theme-color']}; */
        background: var(--theme-color);
      }
    }
  }
}
</style>
