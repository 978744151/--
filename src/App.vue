<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
body,html{
  width: 100%;
  height: 100%;
}
#app {
    height: 100%;
    width: 100%;
    // min-height: 550px;
    // min-width: 768px;
    overflow: hidden;
}
div{
  box-sizing: border-box;
}
*{
  padding: 0;
  margin: 0;
}
input{
  outline: none;
}
</style>
