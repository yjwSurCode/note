<template>
  <div class="pixso-container" ref="containerRef">
    <div class="frame" :style="{ transform: `scale(${scale})`, transformOrigin: 'top left', width: baseWidth + 'px', height: baseHeight + 'px' }">
      <div class="dashboard" style="left: 88px; top: 57px; width: 1440px; height: 1570px"></div>
      <div class="members" style="left: 264px; top: 1011px; width: 709px; height: 519px">
        <div class="item" style="left: 37px; top: 145px; width: 107px; height: 40px">
          <div class="avatar" style="left: 0px; top: 0px; width: 40px; height: 40px; background-image: url('https://pixso.cn/pix/image-url/3824fe67d3582aa43956fc682dfe40b6a6bf69bb')"></div>
          <div class="name" style="left: 49px; top: 7px; width: 58px; height: 22px">申泰</div>
        </div>
        <div class="item" style="left: 38px; top: 219px; width: 106px; height: 40px">
          <div class="avatar" style="left: 0px; top: 0px; width: 40px; height: 40px; background-image: url('https://pixso.cn/pix/image-url/511f7c005216cbfb2308184a96ede63b4eab3270')"></div>
          <div class="name" style="left: 48px; top: 9px; width: 58px; height: 22px">占叶</div>
        </div>
        <div class="item" style="left: 40px; top: 295px; width: 104px; height: 40px">
          <div class="avatar" style="left: 0px; top: 0px; width: 40px; height: 40px; background-image: url('https://pixso.cn/pix/image-url/1955dc2436493041f9fab75f97c3fc10cca4186e')"></div>
          <div class="name" style="left: 46px; top: 9px; width: 58px; height: 22px">豆媛固</div>
        </div>
        <div class="item" style="left: 38px; top: 371px; width: 106px; height: 40px">
          <div class="avatar" style="left: 0px; top: 0px; width: 40px; height: 40px; background-image: url('https://pixso.cn/pix/image-url/48c3fd8c576024b6ab621bd1222ac8c1c0746809')"></div>
          <div class="name" style="left: 48px; top: 9px; width: 58px; height: 22px">琚义晶</div>
        </div>
        <div class="item" style="left: 39px; top: 447px; width: 105px; height: 40px">
          <div class="avatar" style="left: 0px; top: 0px; width: 40px; height: 40px; background-image: url('https://pixso.cn/pix/image-url/d5a469ff3bc51b07bb50b308e93a16be980a96d4')"></div>
          <div class="name" style="left: 47px; top: 9px; width: 58px; height: 22px">裘珍</div>
        </div>
        <div class="op" style="left: 548px; top: 71px; width: 144px; height: 54px">
          <div class="op-border"></div>
          <div class="op-text" style="left: 24px; top: 16px; width: 27px; height: 22px">操作</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const baseWidth = 1657
const baseHeight = 1864

const containerRef = ref<HTMLElement | null>(null)
const scale = ref(1)

function resize() {
  const el = containerRef.value
  if (!el) return
  const w = el.clientWidth
  scale.value = w / baseWidth
  el.style.height = `${baseHeight * scale.value}px`
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.pixso-container { width: 100%; margin: 0 auto; position: relative; }
.frame { position: absolute; left: 0; top: 0; background: #ffffff; }
.dashboard { position: absolute; background: #ffffff; }
.members { position: absolute; }
.item { position: absolute; }
.avatar { position: absolute; background-size: cover; background-position: center; border-radius: 20px; }
.name { position: absolute; font-family: 'PingFang SC', 'Microsoft YaHei', 'Avenir Next', sans-serif; font-size: 14px; line-height: 22px; color: #000; opacity: 0.65; }
.op { position: absolute; }
.op-border { position: absolute; left: 0; top: 0; width: 144px; height: 54px; border: 1px solid #ddd; }
.op-text { position: absolute; font-family: 'PingFang SC', sans-serif; font-size: 14px; line-height: 22px; color: #666; font-weight: 500; }
</style>
