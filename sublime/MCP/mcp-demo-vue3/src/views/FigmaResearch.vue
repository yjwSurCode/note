<template>
  <div class="container" ref="containerRef">
    <div class="frame" :style="{ transform: `scale(${scale})`, transformOrigin: 'top left', width: baseWidth + 'px', height: baseHeight + 'px' }">
      <div class="section" style="left: 0px; top: 0px; width: 375px; height: 160px"></div>
      <div class="section" style="left: 16px; top: 180px; width: 343px; height: 56px"></div>
      <div class="section" style="left: 16px; top: 256px; width: 343px; height: 48px"></div>
      <div class="section" style="left: 16px; top: 320px; width: 343px; height: 740px"></div>
      <div class="section" style="left: 0px; top: 1110px; width: 375px; height: 80px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const baseWidth = 375
const baseHeight = 1190

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
.container { width: 100%; margin: 0 auto; position: relative; }
.frame { position: absolute; left: 0; top: 0; background: #f4f0eb; }
.section { position: absolute; background: #ff0000; }
</style>

