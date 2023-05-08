import { getBannerRequest, getRecommendListRequest } from '@/api/request'
import { defineStore } from 'pinia'

interface State {
  bannerList: any[]
  recommendList: any[]
  enterLoading: boolean
}

export const useRecommendStore = defineStore('recommend', {
  state: (): State => ({
    bannerList: [],
    recommendList: [],
    enterLoading: true,
  }),
  getters: {},
  actions: {
    changeBannerList(payload: any) {
      this.bannerList = payload
    },
    changeRecommendList(payload: any) {
      this.recommendList = payload
    },
    changeEnterLoading(payload: any) {
      this.enterLoading = payload
    },
    async getBannerList() {
      try {
        const { banners }: any = await getBannerRequest()

        this.changeBannerList(banners)
      } catch (error) {
        console.log('轮播图数据传输错误')
      }
    },
    async getRecommendList() {
      try {
        const { result }: any = await getRecommendListRequest()

        this.changeRecommendList(result)
        this.changeEnterLoading(false)
      } catch (error) {
        console.log('推荐歌单数据传输错误')
      }
    },
  },
})
