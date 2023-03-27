<script setup lang="ts">
import BScroll from 'better-scroll'
import { debounce } from '../../api/utils'
import Loading2 from '../loading-v2/index.vue'
import Loading from '../loading/index.vue'
import {
  ref,
  reactive,
  defineProps,
  withDefaults,
  onMounted,
  defineEmits,
} from 'vue'

const props = withDefaults(
  defineProps<{
    direction: string
    refresh: boolean
    // onScroll: () => void
    click: boolean
    pullUp: () => void
    pullDown: () => void
    pullUpLoading: boolean
    pullDownLoading: boolean
    bounceTop: boolean // 是否支持向上吸顶
    bounceBottom: boolean // 是否支持向下吸顶
  }>(),
  {
    direction: 'vertical',
    refresh: true,
    // onScroll: () => {},
    click: true,
    pullUp: () => {},
    pullDown: () => {},
    pullUpLoading: false,
    pullDownLoading: false,
    bounceTop: true,
    bounceBottom: true,
  }
)

const scrollContaninerRef = ref<HTMLDivElement | null>(null)

const pullUpdisplayStyle = reactive<{ display: string }>({ display: '' })
const pullDowndisplayStyle = reactive<{ display: string }>({ display: '' })

const emit = defineEmits(['onScorll', 'refresh'])

const pullUpDebounce = () => {
  return debounce(props.pullUp, 500)
}

const pullDownDebounce = () => {
  return debounce(props.pullDown, 500)
}

onMounted(() => {
  const bScroll = new BScroll(scrollContaninerRef as any, {
    scrollX: props.direction === 'horizontal',
    scrollY: props.direction === 'vertical',
    probeType: 3,
    click: props.click,
    bounce: {
      top: props.bounceTop,
      bottom: props.bounceBottom,
    },
  })

  if (!bScroll) return
  bScroll.on('scroll', emit('onScorll') as any)

  if (!bScroll || !props.pullUp) return
  const handlePullUp = () => {
    // 判断是否滑动到了底部
    if (bScroll.y <= bScroll.maxScrollY + 100) {
      pullUpDebounce()
    }
  }
  bScroll.on('scrollEnd', handlePullUp)
  // return () => {
  //   bScroll.value.off('scrollEnd', handlePullUp)
  // }

  if (!bScroll || !props.pullDown) return
  const handlePullDown = (pos: any) => {
    //判断用户的下拉动作
    if (pos.y > 50) {
      pullDownDebounce()
    }
  }
  bScroll.on('touchEnd', handlePullDown)
  // return () => {
  //   bScroll.off('touchEnd', handlePullDown)
  // }

  if (props.refresh && bScroll) {
    bScroll.refresh()
  }

  pullUpdisplayStyle.display = props.pullUpLoading ? '' : 'none'
  pullDowndisplayStyle.display = props.pullDownLoading ? '' : 'none'
})
</script>

<template>
  <div class="container" ref="scrollContaninerRef">
    {props.children} {/* 滑到底部加载动画 */}
    <div class="pull-up-loading" :style="pullUpdisplayStyle">
      <Loading></Loading>
    </div>
    {/* 顶部下拉刷新动画 */}
    <div class="pull-down-loading" :style="pullDowndisplayStyle">
      <Loading2></Loading2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
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
