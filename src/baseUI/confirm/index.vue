<script setup lang="ts">
import { ref, defineProps, defineExpose, defineEmits } from 'vue'

defineProps<{
  text: string
  cancelBtnText: string
  confirmBtnText: string
}>()

const emit = defineEmits(['handleConfirm'])

const isShow = ref<boolean>(false)

const handleConfirm = () => {
  isShow.value = false
  emit('handleConfirm')
}

defineExpose({
  show() {
    isShow.value = true
  },
})
</script>

<template>
  <Transition name="confirm-fade" :duration="300" appear>
    <div
      class="confirm-wrapper"
      v-if="isShow"
      :style="{ display: isShow ? 'block' : 'none' }"
      @click.stop
    >
      <div>
        <div class="confirm-content">
          <p class="text">{{ text }}</p>
          <div class="operate">
            <div class="operate-btn left" @click="isShow = false">
              {{ cancelBtnText }}
            </div>
            <div class="operate-btn" @click="handleConfirm">
              {{ confirmBtnText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@keyframes confirmFadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirmZoom {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.confirm-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  /* background: ${style['background-color-shadow']}; */
  background: var(--background-color-shadow);

  &.confirm-fade-enter-active {
    animation: confirmFadeIn 0.3s;

    .confirm-content {
      animation: confirmZoom 0.3s;
    }
  }

  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 100;

    .confirm-content {
      width: 270px;
      border-radius: 13px;
      /* background: ${style['highlight-background-color']}; */
      background: var(--highlight-background-color);

      .text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        /* font-size: ${style['font-size-l']}; */
        font-size: var(--font-size-l);
        /* color: ${style['font-color-desc-v2']}; */
        color: var(--font-color-desc-v2);
      }

      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        /* font-size: ${style['font-size-l']}; */
        font-size: var(--font-size-l);

        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          /* border-top: 1px solid ${style['border-color']}; */
          border-top: 1px solid var(--border-color);
          /* color: ${style['font-color-desc']}; */
          color: var(--font-color-desc);

          &.left {
            /* border-right: 1px solid ${style['border-color']}; */
            border-right: 1px solid var(--border-color);
          }
        }
      }
    }
  }
}
</style>
