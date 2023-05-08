import { playMode } from '@/api/config'
import { getSongDetailRequest } from '@/api/request'
import { findIndex } from '@/api/utils'
import { defineStore } from 'pinia'

interface State {
  fullScreen: boolean
  playing: boolean
  sequencePlayList: any[]
  playList: any[]
  mode: number
  currentIndex: number
  showPlayList: boolean
  currentSong: any
  speed: number
}

export const usePlayerStore = defineStore('player', {
  state: (): State => ({
    fullScreen: false,
    playing: false,
    sequencePlayList: [],
    playList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    showPlayList: false,
    currentSong: {},
    speed: 1,
  }),
  getters: {},
  actions: {
    changeCurrentSong(payload: any) {
      this.currentSong = payload
    },
    changeFullScreen(payload: any) {
      this.fullScreen = payload
    },
    changePlayingState(payload: any) {
      this.playing = payload
    },
    changeSequencePlayList(payload: any) {
      this.playList = payload
    },
    changePlayList(payload: any) {
      this.sequencePlayList = payload
    },
    changePlayMode(payload: any) {
      this.mode = payload
    },
    changeSpeed(payload: any) {
      this.currentIndex = payload
    },
    changeCurrentIndex(payload: any) {
      this.currentIndex = payload
    },
    changeShowPlayList(payload: any) {
      this.showPlayList = payload
    },
    insertSong(song: any) {
      const playList = JSON.parse(JSON.stringify(this.playList))
      const sequenceList = JSON.parse(JSON.stringify(this.sequencePlayList))
      let currentIndex = this.currentIndex

      //看看有没有同款
      const fpIndex = findIndex(song, playList)
      // 如果是当前歌曲直接不处理
      if (fpIndex === currentIndex && currentIndex !== -1) return
      currentIndex++
      // 把歌放进去,放到当前播放曲目的下一个位置
      playList.splice(currentIndex, 0, song)
      // 如果列表中已经存在要添加的歌
      if (fpIndex > -1) {
        if (currentIndex > fpIndex) {
          playList.splice(fpIndex, 1)
          currentIndex--
        } else {
          playList.splice(fpIndex + 1, 1)
        }
      }

      let sequenceIndex = findIndex(playList[currentIndex], sequenceList) + 1
      const fsIndex = findIndex(song, sequenceList)
      sequenceList.splice(sequenceIndex, 0, song)
      if (fsIndex > -1) {
        if (sequenceIndex > fsIndex) {
          sequenceList.splice(fsIndex, 1)
          sequenceIndex--
        } else {
          sequenceList.splice(fsIndex + 1, 1)
        }
      }

      this.playList = playList
      this.sequencePlayList = sequenceList
      this.currentIndex = currentIndex
    },
    deleteSong(song: any) {
      const playList = JSON.parse(JSON.stringify(this.playList))
      const sequenceList = JSON.parse(JSON.stringify(this.sequencePlayList))
      let currentIndex = this.currentIndex

      const fpIndex = findIndex(song, playList)
      playList.splice(fpIndex, 1)
      if (fpIndex < currentIndex) currentIndex--

      const fsIndex = findIndex(song, sequenceList)
      sequenceList.splice(fsIndex, 1)

      this.playList = playList
      this.sequencePlayList = sequenceList
      this.currentIndex = currentIndex
    },
    async getSongDetail(id: string) {
      try {
        const {
          songs: [song],
        }: any = await getSongDetailRequest(id)

        this.insertSong(song)
      } catch (error) {
        console.log(error)
      }
    },
  },
})
