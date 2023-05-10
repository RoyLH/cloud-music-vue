<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue'

withDefaults(
  defineProps<{
    title: string
    isMarquee: boolean
  }>(),
  {
    title: '标题',
    isMarquee: false,
  }
)

defineEmits(['handleClick'])
</script>

<template>
  <div class="header-container">
    <i class="iconfont back" @click="$emit('handleClick')"> &#xe655; </i>
    <template v-if="isMarquee">
      <marquee>
        <h1>{{ title }}</h1>
      </marquee>
    </template>
    <template v-else>
      <h1>{{ title }}</h1>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.header-container {
  position: fixed;
  padding: 5px 10px;
  padding-top: 0;
  height: 40px;
  width: 100%;
  z-index: 100;
  display: flex;
  line-height: 40px;
  /* color: ${style['font-color-light']}; */
  color: var(--font-color-light);

  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }

  > h1 {
    /* font-size: ${style['font-size-l']}; */
    font-size: var(--font-size-l);
    font-weight: 700;
  }
}
</style>
