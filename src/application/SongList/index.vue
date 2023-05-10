<script setup lang="ts">
import {
  ref,
  toRefs,
  withDefaults,
  defineEmits,
  watchEffect,
  computed,
} from 'vue'
import { ONE_PAGE_COUNT } from '@/api/config'
import { getName } from '@/api/utils'
import { usePlayerStore } from '@/stores/player'

const props = withDefaults(
  defineProps<{
    songs: any[]
    collectCount?: number
    showCollect: boolean
    loading?: boolean
    usePageSplit?: boolean
    showBackground?: boolean
  }>(),
  {
    loading: true,
  }
)

const {
  songs,
  collectCount,
  showCollect,
  loading,
  usePageSplit,
  showBackground,
} = toRefs(props)

const emit = defineEmits(['musicAnimation'])

const startIndex = ref(0)

const { changePlayList, changeCurrentIndex, changeSequencePlayList } =
  usePlayerStore()

// onMounted(() => {
//   if (!loading.value) return
//   if (startIndex.value + 1 + ONE_PAGE_COUNT >= songs.value.length) return

//   startIndex.value = startIndex.value + ONE_PAGE_COUNT
// })

watchEffect(() => {
  if (!loading.value) return
  if (startIndex.value + 1 + ONE_PAGE_COUNT >= songs.value.length) return

  startIndex.value = startIndex.value + ONE_PAGE_COUNT
})

const songList = computed(() => {
  const list = []

  // 判断页数是否超过总数
  const end = usePageSplit.value
    ? startIndex.value + ONE_PAGE_COUNT
    : list.length

  for (let i = 0; i < end; i++) {
    if (i >= songs.value.length) break
    list.push(songs.value[i])
  }

  return list
})

const selectItem = (e: any, index: number) => {
  changePlayList(songs)
  changeSequencePlayList(songs)
  changeCurrentIndex(index)

  emit('musicAnimation', e.clientX, e.clientY)
}
</script>

<template>
  <div
    class="song-list"
    :style="{
      background: showBackground ? 'fff' : '',
    }"
  >
    <div class="first-line">
      <div class="play-all" @click="selectItem($event, 0)">
        <i class="iconfont">&#xe6e3;</i>
        <span>
          播放全部 <span class="sum">(共{{ songs.length }}首)</span>
        </span>
      </div>
      <div class="add-list" v-if="showCollect && collectCount">
        <i class="iconfont">&#xe62d;</i>
        <span>收藏({{ Math.floor(collectCount / 1000) / 10 }}万)</span>
      </div>
    </div>
    <ul class="song-item">
      <li
        v-for="(item, index) in songList"
        :key="item.id"
        @click="selectItem($event, index)"
      >
        <span class="index">{{ index + 1 }}</span>
        <div class="info">
          <span>{{ item.name }}</span>
          <span>
            {{ item.ar ? getName(item.ar) : getName(item.artists) }} -{{ ' ' }}
            {{ item.al ? item.al.name : item.album.name }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.song-list {
  border-radius: 10px;
  opacity: 0.98;
  /* ${(props: { showBackground?: any }) =>
    props.showBackground
      ? `background: ${style['highlight-background-color']}`
      : ''}; */

  .first-line {
    box-sizing: border-box;
    padding: 10px 0;
    margin-left: 10px;
    position: relative;
    justify-content: space-between;
    /* border-bottom: 1px solid ${style['border-color']}; */
    border-bottom: 1px solid var(--border-color);

    .play-all {
      display: inline-block;
      line-height: 24px;
      /* color: ${style['font-color-desc']}; */
      color: var(--font-color-desc);

      .iconfont {
        font-size: 24px;
        margin-right: 10px;
        vertical-align: top;
      }

      .sum {
        /* font-size: ${style['font-size-s']}; */
        font-size: var(--font-size-s);
        /* color: ${style['font-color-desc-v2']}; */
        color: var(--font-color-desc-v2);
      }

      > span {
        vertical-align: top;
      }
    }

    .add-list,
    .collected {
      display: flex;
      align-items: center;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 130px;
      line-height: 34px;
      /* background: ${style['theme-color']}; */
      background: var(--theme-color);
      /* color: ${style['font-color-light']}; */
      color: var(--font-color-light);
      font-size: 0;
      border-radius: 3px;
      vertical-align: top;

      .iconfont {
        vertical-align: top;
        font-size: 10px;
        margin: 0 5px 0 10px;
      }

      span {
        font-size: 14px;
        line-height: 34px;
      }
    }

    .collected {
      display: flex;
      /* background: ${style['background-color']}; */
      background: var(--background-color);
      /* color: ${style['font-color-desc']}; */
      color: var(--font-color-desc);
    }
  }
}

.song-item {
  > li {
    display: flex;
    height: 60px;
    align-items: center;

    .index {
      flex-basis: 60px;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }

    .info {
      box-sizing: border-box;
      flex: 1;
      display: flex;
      height: 100%;
      padding: 5px 0;
      flex-direction: column;
      justify-content: space-around;
      /* border-bottom: 1px solid ${style['border-color']}; */
      border-bottom: 1px solid var(--border-color);
      /* ${style.noWrap()} */
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      > span {
        /* ${style.noWrap()} */
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      > span:first-child {
        /* color: ${style['font-color-desc']}; */
        color: var(--font-color-desc);
      }

      > span:last-child {
        /* font-size: ${style['font-size-s']}; */
        font-size: var(--font-size-s);
        color: #bba8a8;
      }
    }
  }
}
</style>
