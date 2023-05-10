<script setup lang="ts">
import BScroll from 'better-scroll'
import { debounce } from '@/api/utils'
import Loading2 from '@/baseUI/loading-v2/index.vue'
import Loading from '@/baseUI/loading/index.vue'
import {
  ref,
  toRefs,
  defineProps,
  withDefaults,
  onMounted,
  defineEmits,
  defineExpose,
} from 'vue'

const props = withDefaults(
  defineProps<{
    direction?: string
    refresh?: boolean
    click?: boolean
    scroll?: boolean // 是否有滚动处理逻辑
    pullUp?: boolean // 是否有上拉处理逻辑
    pullDown?: boolean // 是否有下拉处理逻辑
    pullUpLoading?: boolean
    pullDownLoading?: boolean
    bounceTop?: boolean // 是否支持向上吸顶
    bounceBottom?: boolean // 是否支持向下吸顶
  }>(),
  {
    direction: 'vertical',
    refresh: true,
    click: true,
    scroll: false,
    pullUp: false,
    pullDown: false,
    pullUpLoading: false,
    pullDownLoading: false,
    bounceTop: true,
    bounceBottom: true,
  }
)

const {
  direction,
  refresh,
  click,
  scroll,
  pullUp,
  pullDown,
  pullUpLoading,
  pullDownLoading,
  bounceTop,
  bounceBottom,
} = toRefs(props)

const scrollContaninerRef = ref<HTMLDivElement | null>(null)

const emit = defineEmits(['handleScorll', 'handlePullUp', 'handlePullDown'])

let bScroll: BScroll

const initScroll = () => {
  bScroll = new BScroll(scrollContaninerRef as any, {
    scrollX: direction.value === 'horizontal',
    scrollY: direction.value === 'vertical',
    probeType: 3,
    click: click.value,
    bounce: {
      top: bounceTop.value,
      bottom: bounceBottom.value,
    },
  })

  if (scroll.value) {
    const handleScorll = (pos: any) => {
      emit('handleScorll', pos) as any
    }
    bScroll.on('scroll', handleScorll)
  }

  if (pullUp.value) {
    const handlePullUp = (pos: any) => {
      // 判断是否滑动到了底部
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        debounce(emit('handlePullUp', pos) as any, 500)()
      }
    }
    bScroll.on('scrollEnd', handlePullUp)
  }

  if (pullDown.value) {
    const handlePullDown = (pos: any) => {
      // 判断是否有了下拉动作
      if (pos.y > 50) {
        debounce(emit('handlePullDown', pos) as any, 500)()
      }
    }
    bScroll.on('touchEnd', handlePullDown)
  }

  if (refresh.value) {
    bScroll.scrollTo(0, 0)
    bScroll.refresh()
  }
}

onMounted(() => {
  initScroll()
})

defineExpose({
  enable() {
    bScroll?.enable()
  },
  disable() {
    bScroll?.disable()
  },
  refresh() {
    bScroll?.refresh()
    bScroll?.scrollTo(0, 0)
  },
  getBScroll() {
    return bScroll
  },
})
</script>

<template>
  <div class="scroll-container" ref="scrollContaninerRef">
    <slot> </slot>
    <div
      class="pull-up-loading"
      :style="{
        display: pullUpLoading ? '' : 'none',
      }"
    >
      <Loading></Loading>
    </div>
    {/* 顶部下拉刷新动画 */}
    <div
      class="pull-down-loading"
      :style="{
        display: pullDownLoading ? '' : 'none',
      }"
    >
      <Loading2></Loading2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.pull-up-loading {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
}

.pull-down-loading {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 30px;
  margin: auto;
  z-index: 100;
}
</style>
