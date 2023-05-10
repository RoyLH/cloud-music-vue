<script setup lang="ts">
import { getName } from '@/api/utils'
import EnterLoading from '@/baseUI/enter-loading/index.vue'
import Loading from '@/baseUI/loading/index.vue'
import MusicalNote from '@/baseUI/music-note/index.vue'
import Scroll from '@/baseUI/scroll/index.vue'
import SearchBox from '@/baseUI/search-box/index.vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'
import { usePlayerStore } from '@/stores/player'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const loadingSingerUrl = new URL('./singer.png', import.meta.url).href
const loadingMusicUrl = new URL('./music.png', import.meta.url).href

const query = ref('')
const isShow = ref(false)

const musicNoteRef = ref()
const router = useRouter()

const { hotList, enterLoading, suggest, songsList } = storeToRefs(
  useSearchStore()
)
const { playList } = storeToRefs(usePlayerStore())

const { getHotKeyWords, changeEnterLoading, getSuggest } = useSearchStore()
const { getSongDetail } = usePlayerStore()

onMounted(async () => {
  isShow.value = true
  if (!hotList.value.length) await getHotKeyWords()
})

const handleQuery = async (q: any) => {
  query.value = q
  if (!q) return

  changeEnterLoading(true)
  await getSuggest(q)
}

const selectItem = async (e: any, id: string) => {
  await getSongDetail(id)

  musicNoteRef.value.startAnimation({
    x: e.nativeEvent.clientX,
    y: e.nativeEvent.clientY,
  })
}

const searchBack = () => {
  isShow.value = false
}
</script>

<template>
  <Transition :duration="300" appear name="fly" @afterLeave="router.back()">
    <div
      v-if="isShow"
      class="container"
      :style="{
        bottom: playList.length > 0 ? '60px' : '0',
      }"
    >
      <div class="search-box-wrapper">
        <SearchBox
          :back="searchBack"
          :newQuery="query"
          @handleQuery="handleQuery"
        ></SearchBox>
      </div>
      <div
        class="shortcut-wrapper"
        :style="{
          display: !query ? '' : 'none',
        }"
      >
        <Scroll>
          <div>
            <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li
                  v-for="item in hotList || []"
                  class="item"
                  :key="item.first"
                  @click="query = item.first"
                >
                  <span>{{ item.first }}</span>
                </li>
              </ul>
            </div>
            <!-- <div class="search-history">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear">
                  <i class="iconfont">&#xe63d;</i>
                </span>
              </h1>
              {renderHistoryList()}
            </div> -->
          </div>
        </Scroll>
      </div>
      <div
        class="shortcut-wrapper"
        :style="{
          display: query ? '' : 'none',
        }"
      >
        <Scroll onScorll="{forceCheck}">
          <div>
            <div class="list" v-if="suggest.artists.length">
              <h1 class="title">相关歌手</h1>
              <div
                class="list-item"
                v-for="(item, index) in suggest.artists"
                :key="item.accountId + '' + index"
                @click="router.push(`/singers/${item.id}`)"
              >
                <div class="img-wrapper">
                  <img
                    :lazy-load="{
                      src: item.picUrl,
                      loading: loadingSingerUrl,
                    }"
                    width="100%"
                    height="100%"
                    alt="singer"
                  />
                </div>
                <span class="name">歌手: {{ item.name }}</span>
              </div>
            </div>
          </div>
          <div class="list" v-if="suggest.playlists.length">
            <h1 class="title">相关歌单</h1>
            <div
              class="list-item"
              v-for="(item, index) in suggest.playlists"
              :key="item.accountId + '' + index"
              @click="router.push(`/album/${item.id}`)"
            >
              <div class="img-wrapper">
                <img
                  :lazy-load="{
                    src: item.coverImgUrl,
                    loading: loadingMusicUrl,
                  }"
                  width="100%"
                  height="100%"
                  alt="music"
                />
              </div>
              <span class="name">歌单: {{ item.name }}</span>
            </div>
          </div>
          <div class="song-item" :style="{ paddingLeft: '20px' }">
            <li
              v-for="item in songsList"
              :key="item.id"
              @click="selectItem($event, item.id)"
            >
              <div class="info">
                <span>{{ item.name }}</span>
                <span>
                  {{ getName(item.artists) }} - {{ item.album.name }}
                </span>
              </div>
            </li>
          </div>
        </Scroll>
      </div>
      <EnterLoading v-if="enterLoading">
        <Loading></Loading>
      </EnterLoading>
      <MusicalNote ref="musicNoteRef"></MusicalNote>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* bottom: ${(props: { play?: any }) => (props.play > 0 ? '60px' : 0)}; */
  width: 100%;
  z-index: 100;
  overflow: hidden;
  background: #f2f3f4;
  transform-origin: right bottom;

  &.fly-enter,
  &.fly-appear {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  &.fly-enter-active,
  &.fly-appear-active {
    opacity: 1;
    transition: all 0.3s;
    transform: translate3d(0, 0, 0);
  }

  &.fly-exit {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  &.fly-exit-active {
    opacity: 0;
    transition: all 0.3s;
    transform: translate3d(100%, 0, 0);
  }
}

.shortcut-wrapper {
  position: absolute;
  top: 40px;
  bottom: 0;
  width: 100%;
  /* display: ${(props: { show?: any }) => (props.show ? '' : 'none')}; */
}

.hot-key {
  margin: 0 20px 20px;

  .title {
    padding-top: 35px;
    margin-bottom: 20px;
    /* font-size: ${style['font-size-m']}; */
    font-size: var(--font-size-m);
    /* color: ${style['font-color-desc-v2']}; */
    color: var(--font-color-desc-v2);
  }

  .item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    /* background: ${style['highlight-background-color']}; */
    background: var(--highlight-background-color);
    /* font-size: ${style['font-size-m']}; */
    font-size: var(--font-size-m);
    /* color: ${style['font-color-desc']}; */
    color: var(--font-color-desc);
  }
}

.search-history {
  position: relative;
  margin: 0 20px;

  .title {
    display: flex;
    align-items: center;
    height: 40px;
    /* font-size: ${style['font-size-m']}; */
    font-size: var(--font-size-m);
    /* color: ${style['font-color-desc-v2']}; */
    color: var(--font-color-desc-v2);

    .text {
      flex: 1;
    }

    .clear {
      /* ${style.extendClick()} */
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: -10px;
        bottom: -10px;
        left: -10px;
        right: -10px;
      }

      .icon-clear {
        /* font-size: ${style['font-size-m']}; */
        font-size: var(--font-size-m);
        /* color: ${style['font-color-desc']}; */
        color: var(--font-color-desc);
      }
    }
  }

  .history-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    /* color: ${style['font-color-desc-v2']}; */
    color: var(--font-color-desc-v2);
    /* border-bottom: 1px solid ${style['border-color']}; */
    border-bottom: 1px solid var(--border-color);

    .text {
      flex: 1;
      /* font-size: ${style['font-size-s']}; */
      font-size: var(font-size-s);
      /* color: ${style['font-color-desc']}; */
      color: var(--font-color-desc);
    }

    .icon {
      /* ${style.extendClick()} */

      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: -10px;
        bottom: -10px;
        left: -10px;
        right: -10px;
      }

      /* font-size: ${style['font-size-s']}; */
      font-size: var(--font-size-s);

      .icon-delete {
        /* color: ${style['font-color-desc']}; */
        color: var(--font-color-desc);
      }
    }
  }
}

.song-item {
  > li {
    display: flex;
    height: 60px;
    align-items: center;

    .index {
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

.list {
  display: flex;
  margin: auto;
  flex-direction: column;
  overflow: hidden;

  .title {
    margin: 10px 0 10px 10px;
    /* color: ${style['font-color-desc']}; */
    color: var(--font-color-desc);
    /* font-size: ${style['font-size-s']}; */
    font-size: var(--font-size-s);
  }
}

.list-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  margin: 0 5px;
  padding: 5px 0;
  align-items: center;
  /* border-bottom: 1px solid ${style['border-color']}; */
  border-bottom: 1px solid var(--border-color);

  .img-wrapper {
    margin-right: 20px;

    img {
      border-radius: 3px;
      width: 50px;
      height: 50px;
    }
  }

  .name {
    /* font-size: ${style['font-size-m']}; */
    font-size: var(--font-size-m);
    /* color: ${style['font-color-desc']}; */
    color: var(--font-color-desc);
    font-weight: 500;
  }
}
</style>
