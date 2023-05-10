<script setup lang="ts"></script>

<template>
  <div class="loading-wrapper">
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes loading {
  0%,
  100% {
    transform: scale(0);
  }

  50% {
    transform: scale(1);
  }
}

.loading-wrapper {
  > div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 60px;
    height: 60px;
    opacity: 0.6;
    border-radius: 50%;
    /* background-color: ${style['theme-color']}; */
    background-color: var(--theme-color);
    animation: loading 1.4s infinite ease-in;
  }

  > div:nth-child(2) {
    animation-delay: -0.7s;
  }
}
</style>
