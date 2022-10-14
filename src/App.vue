<template>
  <div class="container" :style="{backgroundImage:'url('+require('@/assets/bg.jpeg')+')'}">
    <router-view/>
  </div>
</template>

<style lang="less">
.container{
  position: absolute;
  width: 375px;
  height: 667px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background-size:cover
}
</style>
