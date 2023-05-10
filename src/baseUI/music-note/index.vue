<script setup lang="ts">
import { prefixStyle } from '@/api/utils'
import { ref, onMounted, defineExpose } from 'vue'
const iconsRef = ref()

const ICON_NUMBER = 10

const transform = prefixStyle('transform')

// const createNode = (txt: string) => {
//   const template = `<div class='icon-wrapper'>${txt}</div>`

//   const tempNode = document.createElement('div')
//   tempNode.innerHTML = template
//   return tempNode.firstChild
// }

onMounted(() => {
  // for (let i = 0; i < ICON_NUMBER; i++) {
  //   const node = createNode(
  //     `<div class="iconfont">&#xe642;</div>`
  //   ) as HTMLDivElement

  //   iconsRef.value.current!.appendChild(node)
  // }

  const domArray = [].slice.call(iconsRef.value.children)
  domArray.forEach((item: any) => {
    item.running = false

    item.addEventListener(
      'transitionend',
      function () {
        this.style['display'] = 'none'
        this.style[transform] = `translate3d(0, 0, 0)`
        this.running = false

        const icon = this.querySelector('div')
        icon.style[transform] = `translate3d(0, 0, 0)`
      },
      false
    )
  })
})

defineExpose({
  startAnimation({ x, y }: { x: string; y: string }) {
    for (let i = 0; i < ICON_NUMBER; i++) {
      const domArray = [].slice.call(iconsRef.value.current!.children)

      const item = domArray[i] as any

      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        item.style.left = x + 'px'
        item.style.top = y + 'px'
        item.style.display = 'inline-block'

        setTimeout(() => {
          item.running = true
          item.style[transform] = `translate3d(0, 750px, 0)`

          const icon = item.querySelector('div')
          icon.style[transform] = `translate3d(-40px, 0, 0)`
        }, 20)
        break
      }
    }
  },
})
</script>

<template>
  <div class="container" ref="iconsRef">
    <div
      ref="iconsWrapperRef"
      class="icon-wrapper"
      v-for="(_, index) in ICON_NUMBER"
      :key="index"
    >
      <div class="iconfont">&#xe642;</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  .icon-wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    /* color: ${style['theme-color']}; */
    color: var(--theme-color);
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(0.62, -0.1, 0.86, 0.57);
    transform: translate3d(0, 0, 0);

    > div {
      transition: transform 1s;
    }
  }
}
</style>
