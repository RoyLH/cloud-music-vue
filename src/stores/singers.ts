import { getHotSingerListRequest, getSingerListRequest } from '@/api/request'
import { defineStore } from 'pinia'

interface State {
  category: string
  alpha: string
  singerList: any[]
  enterLoading: boolean
  pullUpLoading: boolean
  pullDownLoading: boolean
  listOffset: number // 请求列表的偏移不是page，是个数
}

export const useSingersStore = defineStore('singers', {
  state: (): State => ({
    category: '',
    alpha: '',
    singerList: [],
    enterLoading: true,
    pullUpLoading: false,
    pullDownLoading: false,
    listOffset: 0,
  }),
  getters: {},
  actions: {
    changeCategory(payload: any) {
      this.category = payload
      this.listOffset = 0
      this.enterLoading = true
    },
    changeAlpha(payload: any) {
      this.alpha = payload
      this.listOffset = 0
      this.enterLoading = true
    },
    changeSingerList(payload: any) {
      this.singerList = payload
    },
    changeListOffset(payload: any) {
      this.listOffset = payload
    },
    changeEnterLoading(payload: any) {
      this.enterLoading = payload
    },
    changePullUpLoading(payload: any) {
      this.pullUpLoading = payload
    },
    changePullDownLoading(payload: any) {
      this.pullDownLoading = payload
    },
    async getHotSingerList() {
      try {
        const { artists }: any = await getHotSingerListRequest(0)

        this.changeSingerList(artists)
        this.changeEnterLoading(false)
        this.changePullDownLoading(false)
        this.changeListOffset(artists.length)
      } catch (error) {
        console.log('热门歌手数据获取失败')
      }
    },
    async refreshMoreHotSingerList() {
      try {
        const { artists }: any = await getHotSingerListRequest(this.listOffset)

        const data = [...this.singerList, ...artists]

        this.changeSingerList(data)
        this.changePullUpLoading(false)
        this.changeListOffset(data.length)
      } catch (error) {
        console.log('热门歌手数据获取失败')
      }
    },
    async getSingerList() {
      try {
        const { artists }: any = await getSingerListRequest(
          this.category,
          this.alpha,
          this.listOffset
        )

        this.changeSingerList(artists)
        this.changeEnterLoading(false)
        this.changePullDownLoading(false)
        this.changeListOffset(artists.length)
      } catch (error) {
        console.log('歌手数据获取失败')
      }
    },
    async refreshMoreSingerList() {
      try {
        const { artists }: any = await getSingerListRequest(
          this.category,
          this.alpha,
          this.listOffset
        )

        const data = [...this.singerList, ...artists]

        this.changeSingerList(data)
        this.changePullUpLoading(false)
        this.changeListOffset(data.length)
      } catch (error) {
        console.log('歌手数据获取失败')
      }
    },
  },
})
