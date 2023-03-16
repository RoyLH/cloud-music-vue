<script setup lang="ts">
import { RouterView } from 'vue-router'
defineProps<{
  msg: string
}>()
</script>

<template>
  singers
  <RouterView />
</template>
