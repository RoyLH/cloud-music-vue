import {
  getHotKeyWordsRequest,
  getResultSongsListRequest,
  getSuggestRequest,
} from '@/api/request'
import { defineStore } from 'pinia'

interface State {
  hotList: any[]
  suggest: any[]
  songsList: any[]
  enterLoading: boolean
}

export const useSearchStore = defineStore('search', {
  state: (): State => ({
    hotList: [],
    suggest: [],
    songsList: [],
    enterLoading: false,
  }),
  getters: {},
  actions: {
    changeHotKeyWords(payload: any) {
      this.hotList = payload
    },
    changeSuggest(payload: any) {
      this.suggest = payload
    },
    changeResultSongs(payload: any) {
      this.songsList = payload
    },
    changeEnterLoading(payload: any) {
      this.enterLoading = payload
    },
    async getHotKeyWords() {
      try {
        const {
          result: { hots },
        }: any = await getHotKeyWordsRequest()

        this.changeHotKeyWords(hots)
      } catch (error) {
        console.log(error)
      }
    },
    async getSuggest(query: string) {
      try {
        const [
          { result: suggest = [] },
          {
            result: { songs = [] },
          },
        ]: any = await Promise.all([
          getSuggestRequest(query),
          getResultSongsListRequest(query),
        ])

        this.changeSuggest(suggest)
        this.changeResultSongs(songs)
        this.changeEnterLoading(false)
      } catch (error) {
        console.log(error)
      }
    },
  },
})
