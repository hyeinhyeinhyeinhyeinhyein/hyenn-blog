<template>
  <div id="app">
      <Header />
    <router-view />
  </div>
</template>

<script>
import Header from './views/Header.vue'
import './assets/fonts/fonts.css'


export default {
  name: 'App',
  components: {
    Header
  },
}
</script>

<style>
#app {
  font-family: 'Pretendard';
}

</style>
