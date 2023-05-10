<script setup lang="ts">
import { playMode } from '@/api/config'
import Lyric from '@/api/lyric-parser'
import { getLyricRequest } from '@/api/request'
import { findIndex, getSongUrl, isEmptyObject, shuffle } from '@/api/utils'
import Toast from '@/baseUI/toast/index.vue'
import { ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import MiniPlayer from './mini-player/index.vue'
import NormalPlayer from './normal-player/index.vue'
import PlayList from './play-list/index.vue'
import { usePlayerStore } from '@/stores/player'

const {
  fullScreen,
  playing,
  currentSong,
  // showPlayList,
  mode,
  speed,
  currentIndex,
  playList,
  sequencePlayList,
} = storeToRefs(usePlayerStore())

const {
  changePlayingState,
  changeFullScreen,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayMode,
  changePlayList,
  changeSpeed,
} = usePlayerStore()

const currentTime = ref(0)
const duration = ref(0)
const currentPlayingLyric = ref('')
const modeText = ref('')

const percent = isNaN(currentTime.value / duration.value)
  ? 0
  : currentTime.value / duration.value

const preSong = ref<any>({})

const audioRef = ref()
const toastRef = ref()

const currentLyric = ref()
const currentLineNum = ref(0)
const songReady = ref(true)

const handleLyric = ({ lineNum, txt }: any) => {
  if (!currentLyric.value) return
  currentLineNum.value = lineNum

  currentPlayingLyric.value = txt
}

const getLyric = (id: string) => {
  let lyric = ''

  if (currentLyric.value) {
    currentLyric.value.stop()
  }

  // 避免songReady恒为false的情况
  setTimeout(() => {
    songReady.value = true
  }, 3000)

  try {
    const { lrc }: any = getLyricRequest(id)
    lyric = lrc && lrc.lyric

    if (!lyric) {
      currentLyric.value.current = null
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric, speed.value)
    currentLyric.value.play()
    currentLineNum.value = 0
    currentLyric.value.seek(0)
  } catch (error) {
    console.log(error)

    currentLyric.value = ''
    songReady.value = true
    audioRef.value.play()
  }
}

const clickPlaying = (e: any, state: boolean) => {
  changePlayingState(state)

  if (currentLyric.value) {
    currentLyric.value.togglePlay(currentTime.value * 1000)
  }
}

const onProgressChange = (curPercent: number) => {
  const newTime = curPercent * duration.value
  currentTime.value = newTime

  audioRef.value.currentTime = newTime

  if (!playing.value) {
    changePlayingState(true)
  }

  if (currentLyric.value) {
    currentLyric.value.seek(newTime * 1000)
  }
}

const updateTime = (e: any) => {
  currentTime.value = e.target.currentTime
}

const handleLoop = () => {
  audioRef.value.currentTime = 0
  changePlayingState(true)

  audioRef.value.play()
  if (currentLyric.value) {
    currentLyric.value.seek(0)
  }
}

const handlePrev = () => {
  if (playList.value.length === 1) {
    handleLoop()
    return
  }
  let index = currentIndex.value - 1
  if (index === 0) index = playList.value.length - 1

  if (!playing) changePlayingState(true)
  changeCurrentIndex(index)
}

const handleNext = () => {
  if (playList.value.length === 1) {
    handleLoop()
    return
  }

  let index = currentIndex.value + 1
  if (index === playList.value.length) index = 0

  if (!playing) changePlayingState(true)
  changeCurrentIndex(index)
}

const handleEnd = () => {
  if (mode.value === playMode.loop) {
    handleLoop()
  } else {
    handleNext()
  }
}

const changeMode = () => {
  const newMode = (mode.value + 1) % 3
  if (newMode === 0) {
    // 顺序模式
    changePlayList(sequencePlayList.value)

    const index = findIndex(currentSong.value, sequencePlayList.value)
    changeCurrentIndex(index)
    modeText.value = '顺序循环'
  } else if (newMode === 1) {
    //单曲循环
    changePlayList(sequencePlayList)
    modeText.value = '单曲循环'
  } else if (newMode === 2) {
    //随机播放
    const newList = shuffle(sequencePlayList.value)
    const index = findIndex(currentSong, newList)

    changePlayList(newList)
    changeCurrentIndex(index)
    modeText.value = '随机播放'
  }

  changePlayMode(newMode)
  toastRef.value.show()
}
const handleError = () => {
  songReady.value = true
  handleNext()
  alert('播放出错')
}

const clickSpeed = (newSpeed: number) => {
  changeSpeed(newSpeed)

  audioRef.value.playbackRate = newSpeed
  currentLyric.value.changeSpeed(newSpeed)
  currentLyric.value.seek(currentTime.value * 1000)
}

const clearPreSong = () => {
  preSong.value = {}
}

watchEffect(() => {
  if (
    !playList.value.length ||
    currentIndex.value === -1 ||
    !playList.value[currentIndex.value] ||
    playList.value[currentIndex.value].id === preSong.value.id ||
    !songReady.value
  )
    return

  songReady.value = false

  const current = playList.value[currentIndex.value]
  changeCurrentSong(current)
  preSong.value = current
  currentPlayingLyric.value = ''

  audioRef.value.current!.src = getSongUrl(current.id)
  audioRef.value.current!.autoplay = true
  audioRef.value.current!.playbackRate = speed

  changePlayingState(true)
  getLyric(current.id)

  currentTime.value = 0
  duration.value = (current.dt / 1000) | 0
})

watch(
  playing,
  playing => {
    playing ? audioRef.value.play() : audioRef.value.pause()
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  fullScreen,
  fullScreen => {
    if (!fullScreen) return

    if (currentLyric.value && currentLyric.value.lines.length) {
      handleLyric({
        lineNum: currentLineNum.value,
        txt: currentLyric.value.current.lines[currentLineNum.value].txt,
      })
    }
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>

<template>
  <div>
    <NormalPlayer
      v-if="!isEmptyObject(currentSong)"
      :song="currentSong"
      :full="fullScreen"
      :playing="playing"
      :mode="mode"
      :percent="percent"
      :modeText="modeText"
      :duration="duration"
      :currentTime="currentTime"
      :currentLyric="currentLyric"
      :currentPlayingLyric="currentPlayingLyric"
      :speed="speed"
      :currentLineNum="currentLineNum"
      @changeMode="changeMode"
      @handlePrev="handlePrev"
      @handleNext="handleNext"
      @onProgressChange="onProgressChange"
      @clickPlaying="clickPlaying"
      @toggleFullScreenDispatch="changeFullScreen"
      @togglePlayListDispatch="changePlayList"
      @clickSpeed="clickSpeed"
    ></NormalPlayer>

    <MiniPlayer
      v-if="!isEmptyObject(currentSong)"
      :playing="playing"
      :full="fullScreen"
      :song="currentSong"
      :percent="percent"
      @clickPlaying="clickPlaying"
      @setFullScreen="changeFullScreen"
      @togglePlayList="changeShowPlayList"
    ></MiniPlayer>
    )

    <PlayList @clearPreSong="clearPreSong"></PlayList>
    <audio
      ref="audioRef"
      @timeupdate="updateTime"
      @ended="handleEnd"
      @error="handleError"
    ></audio>
    <Toast :text="modeText" ref="toastRef"></Toast>
  </div>
</template>
