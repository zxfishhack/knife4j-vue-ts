<template>
  <div id="app">
    <config-provider >
      <router-view />
    </config-provider>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {

}
</script>
<style lang="less">
@import url("style/knife4j.less");
</style>
<style lang="less">
body {
  overflow: hidden;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
