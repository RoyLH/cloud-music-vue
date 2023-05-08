import { getAlbumDetailRequest } from '@/api/request'
import { defineStore } from 'pinia'

interface State {
  currentAlbum: any
  pullUpLoading: boolean
  enterLoading: boolean
  startIndex: number
  totalCount: number
}

export const useAlbumStore = defineStore('album', {
  state: (): State => ({
    currentAlbum: {},
    pullUpLoading: false,
    enterLoading: false,
    startIndex: 0,
    totalCount: 0,
  }),
  getters: {},
  actions: {
    changeCurrentAlbum(payload: any) {
      this.currentAlbum = payload
    },
    changePullUpLoading(payload: any) {
      this.pullUpLoading = payload
    },
    changeEnterLoading(payload: any) {
      this.enterLoading = payload
    },
    changeStartIndex(payload: any) {
      this.startIndex = payload
      this.pullUpLoading = false
    },
    changeTotalCount(payload: any) {
      this.totalCount = payload
    },
    async getAlbumList(id: string) {
      try {
        const { playlist }: any = await getAlbumDetailRequest(id)

        this.changeCurrentAlbum(playlist)
        this.changeEnterLoading(false)
        this.changeStartIndex(0)
        this.changeTotalCount(playlist.tracks.length)
      } catch (error) {
        console.log('获取album数据失败')
      }
    },
  },
})
