import { createRouter, createWebHistory } from 'vue-router'

const Recommend = import('@/components/Recommend/index.vue')
const Album = import('@/components/Album/index.vue')
const Rank = import('@/components/Rank/index.vue')
const Singers = import('@/components/Singers/index.vue')
const Singer = import('@/components/Singer/index.vue')
const Search = import('@/components/Search/index.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/recommend',
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Album,
        },
      ],
    },
    {
      path: '/singers',
      component: Singers,
      children: [
        {
          path: ':id',
          component: Singer,
        },
      ],
    },
    {
      path: '/rank',
      component: Rank,
    },
    {
      path: 'album/:id',
      component: Album,
    },
    {
      path: '/search',
      component: Search,
    },
  ],
})

export default router
