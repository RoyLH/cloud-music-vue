import { getBannerRequest, getRecommendListRequest } from '@/api/request'
import { defineStore } from 'pinia'
// import { computed, reactive, ref } from 'vue'

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
      getBannerRequest()
        .then((res: any) => {
          const { banners } = res

          this.changeBannerList(banners)
        })
        .catch(() => {
          console.log('轮播图数据传输错误')
        })
    },
    async getRecommendList() {
      getRecommendListRequest()
        .then((res: any) => {
          const { result } = res

          this.changeRecommendList(result)
          this.changeEnterLoading(false)
        })
        .catch(() => {
          console.log('推荐歌单数据传输错误')
        })
    },
  },
})
