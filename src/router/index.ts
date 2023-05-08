import { createRouter, createWebHistory } from 'vue-router'

const HomeLayout = import('@/layouts/HomeLayout.vue')

const Recommend = import('@/application/Recommend/index.vue')
const Album = import('@/application/Album/index.vue')
const Rank = import('@/application/Rank/index.vue')
const Singers = import('@/application/Singers/index.vue')
const Singer = import('@/application/Singer/index.vue')
const Search = import('@/application/Search/index.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeLayout,
      children: [
        {
          path: '',
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
          children: [
            {
              path: ':id',
              component: Album,
            },
          ],
        },
        {
          path: '/album/:id',
          component: Album,
        },
        {
          path: '/search',
          component: Search,
        },
      ],
    },
  ],
})

export default router
