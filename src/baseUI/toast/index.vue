<script setup lang="ts">
import { ref, defineProps, defineExpose } from 'vue'

defineProps<{
  text: string
}>()

const isShow = ref<boolean>(false)
const timer = ref<any>(null)

defineExpose({
  show() {
    if (timer.value) clearTimeout(timer)
    isShow.value = true

    timer.value = setTimeout(() => {
      isShow.value = false
    }, 3000)
  },
})
</script>

<template>
  <Transition name="drop" :duration="300">
    <div v-if="isShow" class="toast-wrapper">
      <div class="text">{{ text }}</div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.toast-wrapper {
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 50px;
  /* background: ${style['highlight-background-color']}; */
  /* background: var(--highlight-background-color); */

  &.drop-enter {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  &.drop-enter-active {
    opacity: 1;
    transition: all 0.3s;
    transform: translate3d(0, 0, 0);
  }

  &.drop-leave-active {
    opacity: 0;
    transition: all 0.3s;
    transform: translate3d(0, 100%, 0);
  }

  .text {
    line-height: 50px;
    text-align: center;
    color: #fff;
    /* font-size: ${style['font-size-l']}; */
    font-size: var(--font-size-l);
  }
}
</style>
