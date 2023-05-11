<script setup lang="ts">
import { HEADER_HEIGHT } from '@/api/config'
import { isEmptyObject } from '@/api/utils'
import EnterLoading from '@/baseUI/enter-loading/index.vue'
import Header from '@/baseUI/header/index.vue'
import Loading from '@/baseUI/loading/index.vue'
import MusicNote from '@/baseUI/music-note/index.vue'
import Scroll from '@/baseUI/scroll/index.vue'
import AlbumDetail from '@/components/album-detail/index.vue'
import { useRouter, useRoute } from 'vue-router'
import { useAlbumStore } from '@/stores/album'
import { usePlayerStore } from '@/stores/player'
import { ref, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

const showStatus = ref<boolean>(true)
const title = ref<string>('歌单')
const isMarquee = ref<boolean>(true)

const musicNoteRef = ref()
const headerRef = ref()
const scrollRef = ref()

const router = useRouter()
const {
  params: { id },
} = useRoute()

const { currentAlbum, enterLoading, pullUpLoading } = storeToRefs(
  useAlbumStore()
)
const { playList } = storeToRefs(usePlayerStore())

const { changeEnterLoading, getAlbumList, changePullUpLoading } =
  useAlbumStore()

const handleScroll = (pos: any) => {
  const minScrollY = -HEADER_HEIGHT
  const percent = Math.abs(pos.y / minScrollY)

  if (pos.y < minScrollY) {
    headerRef.value.$el.style.backgroundColor = '#d44439'
    headerRef.value.$el.style.opacity = String(Math.min(1, (percent - 1) / 2))

    title.value = currentAlbum.value && currentAlbum.value.name
    isMarquee.value = true
  } else {
    headerRef.value.$el.style.backgroundColor = ''
    headerRef.value.$el.style.opacity = '1'

    title.value = '歌单'
    isMarquee.value = false
  }
}

const handlePullUp = () => {
  changePullUpLoading(true)
  changePullUpLoading(false)
}

const handleBack = () => {
  showStatus.value = false
}

const musicAnimation = (x: any, y: any) => {
  musicNoteRef.value.startAnimation({ x, y })
}

onMounted(async () => {
  changeEnterLoading(true)
  await getAlbumList(id as string)

  await nextTick()
  scrollRef.value.refresh()
})
</script>

<template>
  <Transition appear name="fly" :duration="300" @afterLeave="router.back()">
    <div
      v-if="showStatus"
      class="container"
      :style="{ bottom: playList.length > 0 ? '60px' : '0' }"
    >
      <Header
        ref="headerRef"
        :title="title"
        :isMarquee="isMarquee"
        @handleClick="handleBack"
      ></Header>
      <Scroll
        v-if="!isEmptyObject(currentAlbum)"
        ref="scrollRef"
        :scroll="true"
        :pullUp="true"
        :pullUpLoading="pullUpLoading"
        :bounceTop="false"
        @handleScroll="handleScroll"
        @handlePullUp="handlePullUp"
      >
        <AlbumDetail
          :currentAlbum="currentAlbum"
          :pullUpLoading="pullUpLoading"
          @musicAnimation="musicAnimation"
        ></AlbumDetail>
      </Scroll>
      <EnterLoading v-if="enterLoading">
        <Loading></Loading>
      </EnterLoading>
      <MusicNote ref="musicNoteRef"></MusicNote>
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
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }

  &.fly-enter-active,
  &.fly-appear-active {
    transition: transform 0.3s;
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }

  &.fly-exit {
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }

  &.fly-exit-active {
    transition: transform 0.3s;
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }
}

.top-desc {
  background-size: 100%;
  padding: 5px 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  width: 100%;
  height: 200px;
  position: relative;
  z-index: 100;

  .background {
    /* z-index: -1; */
    /* background: url(${(props: { background?: any }) => props.background}) left
      top no-repeat; */
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(20px);
    transform: scale(1.5);
  }

  .img-wrapper {
    width: 120px;
    height: 120px;
    position: relative;

    .decorate {
      position: absolute;
      top: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(
        hsla(0deg, 0%, 43%, 0.4),
        hsla(0deg, 0%, 100%, 0)
      );
    }

    .play-count {
      position: absolute;
      right: 2px;
      top: 2px;
      /* font-size: ${style['font-size-s']}; */
      font-size: var(--font-size-s);
      line-height: 15px;
      /* color: ${style['font-color-light']}; */
      color: var(--font-color-light);

      .play {
        vertical-align: top;
      }
    }

    img {
      width: 120px;
      height: 120px;
      border-radius: 3px;
    }
  }

  .desc-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 120px;
    padding: 0 10px;

    .title {
      max-height: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      /* color: ${style['font-color-desc']}; */
      color: var(--font-color-desc);
      font-weight: 700;
      line-height: 1.5;
      /* font-size: ${style['font-size-l']}; */
      font-size: var(--font-size-l);
    }

    .person {
      display: flex;

      .avatar {
        width: 20px;
        height: 20px;
        margin-right: 5px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .name {
        line-height: 20px;
        /* font-size: ${style['font-size-m']}; */
        font-size: var(--font-size-m);
        /* color: ${style['font-color-desc']}; */
        color: var(--font-color-desc);
      }
    }
  }
}

.menu {
  position: relative;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  margin: 0 30px;
  margin-top: -20px;
  margin-bottom: 10px;

  > div {
    display: flex;
    flex-direction: column;
    line-height: 20px;
    text-align: center;
    /* font-size: ${style['font-size-s']}; */
    font-size: var(--font-size-s);
    color: #3b1f1f;
    /* color: ${style['font-color-desc']}; */
    color: var(--font-color-desc);
    z-index: 1000;
    font-weight: 500;

    .iconfont {
      font-size: 20px;
    }
  }
}

.song-list {
  border-radius: 10px;
  opacity: 0.98;

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

    .add-list {
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
</style>
