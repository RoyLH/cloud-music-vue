<script setup lang="ts">
import { filterIndex } from '@/api/utils'
import { useRouter, RouterView } from 'vue-router'
import { useRankStore } from '@/stores/rank'
import { usePlayerStore } from '@/stores/player'
import { onMounted, ref, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import EnterLoading from '@/baseUI/enter-loading/index.vue'
import Loading from '@/baseUI/loading/index.vue'
import Scroll from '@/baseUI/scroll/index.vue'

const { rankList, loading } = storeToRefs(useRankStore())
const { playList } = storeToRefs(usePlayerStore())

const { getRankList } = useRankStore()

const router = useRouter()
const scrollRef = ref()

const officialList = computed(() => {
  return rankList.value.slice(0, filterIndex(rankList.value))
})
const globalList = computed(() => {
  return rankList.value.slice(filterIndex(rankList.value))
})

onMounted(async () => {
  if (!rankList.value.length) {
    await getRankList()
  }

  await nextTick()
  scrollRef.value.refresh()
})

const enterDetail = (detail: any) => {
  router.push(`/rank/${detail.id}`)
}
</script>

<template>
  <div
    class="container"
    :style="{ bottom: playList.length > 0 ? '60px' : '0' }"
  >
    <Scroll ref="scrollRef">
      <div>
        <h1 class="offical" :style="{ display: loading ? 'none' : '' }">
          官方榜
        </h1>
        <div class="list">
          <div
            class="list-item"
            v-for="(item, index) in officialList"
            :key="`${item.coverImgId}${index}`"
            :tracks="item.tracks"
            :style="{ display: item.tracks.length ? 'flex' : '' }"
            @click="enterDetail(item)"
          >
            <div
              class="img-wrapper"
              :style="{
                width: item.tracks.length ? '27vw' : '32vw',
                height: item.tracks.length ? '27vw' : '32vw',
              }"
            >
              <img :src="item.coverImgUrl" alt="" />
              <div class="decorate"></div>
              <span class="update-frequecy">{{ item.updateFrequency }}</span>
            </div>
            <ul class="song-list" v-if="item.tracks.length">
              <li :key="index" v-for="(value, index) in item.tracks">
                {{ index + 1 }}. {{ value.first }} - {{ value.second }}
              </li>
            </ul>
          </div>
        </div>
        <h1 class="global" :style="{ display: loading ? 'none' : '' }">
          全球榜
        </h1>
        <div class="list" :style="{ display: 'flex' }">
          <div
            class="list-item"
            v-for="(item, index) in globalList"
            :key="`${item.coverImgId}${index}`"
            :tracks="item.tracks"
            @click="enterDetail(item)"
            :style="{ display: item.tracks.length ? 'flex' : '' }"
          >
            <div
              class="img-wrapper"
              :style="{
                width: item.tracks.length ? '27vw' : '32vw',
                height: item.tracks.length ? '27vw' : '32vw',
              }"
            >
              <img :src="item.coverImgUrl" alt="" />
              <div class="decorate"></div>
              <span class="update-frequecy">{{ item.updateFrequency }}</span>
            </div>
            <ul class="song-list" v-if="item.tracks.length">
              <li :key="index" v-for="(value, index) in item.tracks">
                {{ index + 1 }}. {{ value.first }} - {{ value.second }}
              </li>
            </ul>
          </div>
        </div>
        <EnterLoading v-if="loading">
          <Loading></Loading>
        </EnterLoading>
      </div>
    </Scroll>
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: fixed;
  top: 90px;
  /* bottom: ${(props: { play?: any }) => (props.play > 0 ? '60px' : 0)}; */
  width: 100%;

  .offical,
  .global {
    margin: 10px 5px;
    padding-top: 15px;
    font-weight: 700;
    /* font-size: ${style['font-size-m']}; */
    font-size: var(--font-size-m);
    /* color: ${style['font-color-desc']}; */
    color: var(--font-color-desc);
  }

  .offical {
    margin-top: 0;
  }
}

.list {
  margin-top: 10px;
  padding: 0 5px;
  /* display: ${(props: { globalRank?: any }) => (props.globalRank ? 'flex' : '')}; */
  flex-flow: row wrap;
  justify-content: space-between;
  /* background: ${style['background-color']}; */
  background: var(--background-color);

  &::after {
    content: '';
    display: block;
    width: 32vw;
  }
}

.list-item {
  /* display: ${(props: { tracks?: any }) => (props.tracks.length ? 'flex' : '')}; */
  padding: 3px 0;
  /* border-bottom: 1px solid ${style['border-color']}; */
  border-bottom: 1px solid var(--border-color);

  .img-wrapper {
    /* width: ${(props: { tracks?: any }) =>
      props.tracks.length ? '27vw' : '32vw'};
    height: ${(props: { tracks?: any }) =>
      props.tracks.length ? '27vw' : '32vw'}; */
    border-radius: 3px;
    position: relative;

    .decorate {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(
        hsla(0deg, 0%, 100%, 0),
        hsla(0deg, 0%, 43%, 0.4)
      );
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }

    .update-frequecy {
      position: absolute;
      left: 7px;
      bottom: 7px;
      /* font-size: ${style['font-size-ss']}; */
      font-size: var(--font-size-ss);
      /* color: ${style['font-color-light']}; */
      color: var(--font-color-light);
    }
  }
}

.song-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;

  > li {
    /* font-size: ${style['font-size-s']}; */
    font-size: var(--font-size-s);
    color: grey;
  }
}
</style>
