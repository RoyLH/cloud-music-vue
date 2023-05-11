<script setup lang="ts">
import { debounce } from '@/api/utils'
import { defineEmits, defineProps, onMounted, ref, toRefs, watch } from 'vue'

const props = defineProps<{
  newQuery: string
}>()

const { newQuery } = toRefs(props)

const emit = defineEmits(['handleQuery', 'back'])

const query = ref<string>('')

const queryRef = ref()

const handleQueryDebounce = (query: string) => {
  return debounce(emit('handleQuery', query) as any, 500)
}

onMounted(() => {
  queryRef.value.focus()
})

watch(
  query,
  query => {
    handleQueryDebounce(query)
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  newQuery,
  newQuery => {
    let curQuery = query.value
    if (newQuery !== query.value) {
      curQuery = newQuery
      queryRef.value.value = newQuery
    }

    query.value = curQuery
  },
  {
    immediate: true,
    deep: true,
  }
)

const handleChange = (e: any) => {
  query.value = e.target.value
}

const clearQuery = () => {
  query.value = ''
  queryRef.value.value = ''
  queryRef.value.focus()
}

// const displayStyle = query.value ? { display: 'block' } : { display: 'none' }
</script>

<template>
  <div class="search-box-wrapper">
    <i class="iconfont icon-back" @click="$emit('back')"> &#xe655; </i>
    <input
      ref="queryRef"
      class="box"
      placeholder="搜索歌曲、歌手、专辑"
      @input="handleChange"
    />
    <i
      class="iconfont icon-delete"
      @click="clearQuery"
      :style="{ display: query ? 'block' : 'none' }"
    >
      &#xe600;
    </i>
  </div>
</template>

<style lang="scss" scoped>
.search-box-wrapper {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  padding-right: 20px;
  height: 40px;
  /* background: ${style['theme-color']}; */
  background: var(--theme-color);

  .icon-back {
    font-size: 24px;
    /* color: ${style['font-color-light']}; */
    color: var(--font-color-light);
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    /* background: ${style['theme-color']}; */
    background: var(--theme-color);
    /* color: ${style['highlight-background-color']}; */
    color: var(--highlight-background-color);
    /* font-size: ${style['font-size-m']}; */
    font-size: var(--font-size-m);
    outline: none;
    border: none;
    /* border-bottom: 1px solid ${style['border-color']}; */
    border-bottom: 1px solid var(--border-color);

    &::placeholder {
      /* color: ${style['font-color-light']}; */
      color: var(--font-color-light);
    }
  }

  .icon-delete {
    font-size: 16px;
    /* color: ${style['background-color']}; */
    color: var(--background-color);
  }
}
</style>
