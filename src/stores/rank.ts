import { getRankListRequest } from '@/api/request'
import { defineStore } from 'pinia'

interface State {
  rankList: any[]
  loading: boolean
}

export const useRankStore = defineStore('rank', {
  state: (): State => ({
    rankList: [],
    loading: true,
  }),
  getters: {},
  actions: {
    changeRankList(payload: any) {
      this.rankList = payload
    },
    changeLoading(payload: any) {
      this.loading = payload
    },
    async getRankList() {
      try {
        const { list }: any = await getRankListRequest()

        this.changeRankList(list)
        this.changeLoading(false)
      } catch (error) {
        console.log(error)
      }
    },
  },
})
