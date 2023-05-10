<script setup lang="ts"></script>

<template>
  <div class="enter-loading-wrapper">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.enter-loading-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  height: 100px;
  margin: auto;
}
</style>
