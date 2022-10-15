<template>
  <div class="container">
    <router-view/>
  </div>
</template>

<style lang="less" >
* {
  font-family: Noto Sans SC;
  font-style: normal;
  font-weight: 400;
}
.container {
  position: absolute;
  width: 375px;
  height: 667px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(162.46deg, #FFA466 0%, #F56BF2 50%, #66FEFE 100%);
}
</style>
