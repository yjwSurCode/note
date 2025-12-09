<template>
  <div class="frame">
    <div class="wrap-parent">
      <div class="wrap ellipse-wrap"><div class="ellipse red"></div></div>
      <div class="wrap img-1-wrap"><div class="img-1 red"></div></div>
      <div class="wrap img-2-wrap"><div class="img-2 red"></div></div>
      <div class="wrap img-3-wrap"><div class="img-3 red"></div></div>
      <div class="wrap img-4-wrap"><div class="img-4 red"></div></div>
      <div class="wrap img-5-wrap"><div class="img-5 red"></div></div>
      <div class="wrap img-6-wrap"><div class="img-6 red"></div></div>
      <div class="wrap tabbar-wrap"><div class="tabbar red"></div></div>
    </div>
    <div class="name">Jane</div>
    <div class="location">San francisco, ca</div>
    <div class="btn follow">follow jane</div>
    <div class="btn message">message</div>
    <div class="btn see-more">see more</div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.frame {
  position: relative;
  width: 375px;
  height: 1549px;
  margin: 0 auto;
  background: #ffffff;
}

.wrap-parent {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 375px;
  height: 1549px;
  overflow: auto;
}

.red {
  background: #ff0000;
}

.wrap {
  position: absolute;
  overflow: auto;
}

.ellipse-wrap { left: 124px; top: 76px; width: 128px; height: 128px; }
.ellipse { position: relative; width: 100%; height: 100%; border-radius: 50%; }

.name {
  position: absolute;
  left: 142px;
  top: 236px;
  width: 92px;
  height: 40px;
  color: #000000;
  font-family: Comfortaa, sans-serif;
  font-size: 36px;
  font-weight: 400;
  letter-spacing: -1.5%;
  text-align: center;
  line-height: 40px;
}

.location {
  position: absolute;
  left: 121px;
  top: 292px;
  width: 133px;
  height: 15px;
  color: #000000;
  font-family: Roboto, sans-serif;
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 4%;
  text-align: center;
  line-height: 15px;
}

.img-1-wrap { left: 16px; top: 491px; width: 167px; height: 220px; }
.img-1 { position: relative; width: 100%; height: 100%; }

.img-2-wrap { left: 192px; top: 491px; width: 167px; height: 310px; }
.img-2 { position: relative; width: 100%; height: 100%; }

.img-3-wrap { left: 192px; top: 811px; width: 167px; height: 310px; }
.img-3 { position: relative; width: 100%; height: 100%; }

.img-4-wrap { left: 16px; top: 721px; width: 167px; height: 310px; }
.img-4 { position: relative; width: 100%; height: 100%; }

.img-5-wrap { left: 16px; top: 1040px; width: 167px; height: 310px; }
.img-5 { position: relative; width: 100%; height: 100%; }

.img-6-wrap { left: 192px; top: 1130px; width: 167px; height: 220px; }
.img-6 { position: relative; width: 100%; height: 100%; }

.btn {
  position: absolute;
  left: 16px;
  width: 343px;
  height: 52px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Roboto, sans-serif;
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 4%;
}

.follow {
  top: 339px;
  background: #000000;
  color: #ffffff;
  border: 2px solid #000000;
}

.message {
  top: 407px;
  background: #ffffff;
  color: #000000;
  border: 2px solid #000000;
}

.see-more {
  top: 1382px;
  background: #ffffff;
  color: #000000;
  border: 2px solid #000000;
}

.tabbar-wrap { left: 0px; top: 1466px; width: 375px; height: 83px; }
.tabbar { position: relative; width: 100%; height: 100%; }
</style>
