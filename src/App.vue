<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "App",
  components: {},
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
  font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  /* 字体加粗 */
  /* font-weight:400 */
}
#app,
body,
html {
  height: 100%;
}
::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 5px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: #5A5A5A;
  transition: color 0.2s ease;
}
</style>
