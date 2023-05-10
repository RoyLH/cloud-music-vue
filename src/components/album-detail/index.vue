<script setup lang="ts">
import { toRefs, defineProps, defineEmits } from 'vue'
import SongsList from '@/application/SongList/index.vue'

const props = defineProps<{
  currentAlbum: any
  pullUpLoading: boolean
}>()

const { currentAlbum } = toRefs(props)

defineEmits(['musicAnimation'])
</script>

<template>
  <div>
    <div class="top-desc" background="{currentAlbum.coverImgUrl}">
      <div
        class="background"
        :style="{
          background: `url(${currentAlbum.coverImgUrl}) left top no-repeat`,
          backgroundSize: '100% 100%',
        }"
      >
        <div class="filter"></div>
      </div>
      <div class="img-wrapper">
        <div class="decorate"></div>
        <img :src="currentAlbum.coverImgUrl" alt="" />
        <div class="play-count">
          <i class="iconfont play">&#xe885;</i>
          <span class="count">
            {{ Math.floor(currentAlbum.subscribedCount / 1000) / 10 }}万
          </span>
        </div>
      </div>
      <div class="desc-wrapper">
        <div class="title">{{ currentAlbum.name }}</div>
        <div class="person">
          <div class="avatar">
            <img :src="currentAlbum.creator?.avatarUrl" alt="" />
          </div>
          <div class="name">{{ currentAlbum.creator?.nickname }}</div>
        </div>
      </div>
    </div>
    <div class="menu">
      <div>
        <i class="iconfont">&#xe6ad;</i>
        评论
      </div>
      <div>
        <i class="iconfont">&#xe86f;</i>
        点赞
      </div>
      <div>
        <i class="iconfont">&#xe62d;</i>
        收藏
      </div>
      <div>
        <i class="iconfont">&#xe606;</i>
        更多
      </div>
    </div>
    <SongsList
      :songs="currentAlbum.tracks"
      :collectCount="currentAlbum.subscribedCount"
      :showCollect="true"
      :loading="pullUpLoading"
      :showBackground="true"
      @musicAnimation="$emit('musicAnimation')"
    ></SongsList>
  </div>
</template>

<style lang="scss" scoped>
.top-desc {
  background-size: 100%;
  padding: 5px 20px;
  padding-bottom: 50px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 275px;
  position: relative;

  .background {
    z-index: -1;
    /* background: url(${(props: { background?: any }) => props.background}) left
      top no-repeat; */
    background: contain;
    background-position: 0 0;
    background-size: 100% 100%;
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(20px);

    .filter {
      position: absolute;
      z-index: 10;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.2);
    }
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
      /* color: ${style['font-color-light']}; */
      color: var(--font-color-light);
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
        /* color: ${style['font-color-desc-v2']}; */
        color: var(--font-color-desc-v2);
      }
    }
  }
}

.menu {
  position: relative;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 30px 20px;
  margin: -100px 0 0;

  > div {
    display: flex;
    flex-direction: column;
    line-height: 20px;
    text-align: center;
    /* font-size: ${style['font-size-s']}; */
    font-size: var(--font-size-s);
    color: #3b1f1f;
    /* color: ${style['font-color-light']}; */
    color: var(--font-color-light);
    z-index: 1000;
    font-weight: 500;

    .iconfont {
      font-size: 20px;
    }
  }
}
</style>
