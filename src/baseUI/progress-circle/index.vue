<script setup lang="ts">
import { defineProps, toRefs, computed } from 'vue'

const props = defineProps<{
  radius: number
  percent: number
}>()

const { radius, percent } = toRefs(props)

//整个背景的周长
const dashArray = Math.PI * 100
//没有高亮的部分，剩下高亮的就是进度
const dashOffset = computed(() => {
  return (1 - percent.value) * dashArray
})
</script>

<template>
  <div class="circle-wrapper">
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :strokeDasharray="dashArray"
        :strokeDashoffset="dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.circle-wrapper {
  position: relative;

  circle {
    stroke-width: 8px;
    transform-origin: center;

    &.progress-background {
      transform: scale(0.9);
      /* stroke: ${style['theme-color-shadow']}; */
      stroke: var(--theme-color-shadow);
    }

    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      /* stroke: ${style['theme-color']}; */
      stroke: var(--theme-color);
    }
  }
}
</style>
