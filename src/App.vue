<template>
  <div id="app">
    <div class="background" />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: var(--background-color-base);
  background-image: var(--background-image);
  z-index: -1;
}
</style>
