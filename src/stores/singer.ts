import { getSingerInfoRequest } from '@/api/request'
import { defineStore } from 'pinia'

interface State {
  artist: any
  songsOfArtist: any[]
  loading: boolean
}

export const useSingerStore = defineStore('singer', {
  state: (): State => ({
    artist: {},
    songsOfArtist: [],
    loading: true,
  }),
  getters: {},
  actions: {
    changeArtist(payload: any) {
      this.artist = payload
    },
    changeSongs(payload: any) {
      this.songsOfArtist = payload
    },
    changeEnterLoading(payload: any) {
      this.loading = payload
    },
    async getSingerInfo(id: string) {
      try {
        const { artist, hotSongs }: any = await getSingerInfoRequest(id)

        this.changeArtist(artist)
        this.changeSongs(hotSongs)
        this.changeEnterLoading(false)
      } catch (error) {
        console.log(error)
      }
    },
  },
})
