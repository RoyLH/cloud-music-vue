<script setup lang="ts">
import {
  ref,
  toRefs,
  defineProps,
  defineEmits,
  withDefaults,
  onMounted,
  nextTick,
} from 'vue'
import Scroll from '@/baseUI/scroll/index.vue'

const props = withDefaults(
  defineProps<{
    list?: any[]
    oldVal?: any
    title?: string
  }>(),
  {
    list: () => [],
    oldVal: '',
    title: '',
  }
)

const emit = defineEmits(['handleClick'])

const { list, oldVal, title } = toRefs(props)

const categoryRef = ref()
const scrollRef = ref()

onMounted(async () => {
  const tagElems = categoryRef.value.querySelectorAll('span')

  let totalWidth = 0
  Array.from(tagElems).forEach((ele: any) => {
    totalWidth += ele.offsetWidth
  })

  // 选中项的 border-left + border-right
  totalWidth += 2
  categoryRef.value.style.width = `${totalWidth}px`

  await nextTick()
  scrollRef.value.refresh()
})

const handleClick = (item: any) => {
  emit('handleClick', item.key)
}
</script>

<template>
  <Scroll :direction="'horizontal'">
    <div ref="categoryRef">
      <div class="list">
        <span>{{ title }}</span>
        <div
          v-for="item in list"
          class="list-item"
          :key="item.key"
          :class="oldVal === item.key ? 'selected' : ''"
          @click="handleClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </Scroll>
</template>

<style lang="scss" scoped>
.list {
  display: flex;
  align-items: center;
  height: 30px;
  justify-content: center;
  overflow: hidden;

  > span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    color: grey;
    /* font-size: ${style['font-size-m']}; */
    font-size: var(font-size-m);
    /* vertical-align: middle; */
  }
}

.list-item {
  flex: 0 0 auto;
  /* font-size: ${style['font-size-m']}; */
  font-size: var(font-size-m);
  padding: 5px;
  border-radius: 10px;

  &.selected {
    /* color: ${style['theme-color']}; */
    color: var(--theme-color);
    /* border: 1px solid ${style['theme-color']}; */
    border: 1px solid var(--theme-color);
    opacity: 0.8;
  }
}
</style>
