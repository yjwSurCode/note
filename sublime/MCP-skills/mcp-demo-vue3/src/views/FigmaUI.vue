<template>
  <div class="container" ref="containerRef">
    <div class="frame" :style="{ transform: `scale(${scale})`, transformOrigin: 'top left', width: baseWidth + 'px', height: baseHeight + 'px' }">
      <div class="section" style="left: 0px; top: 0px; width: 1440px; height: 180px"></div>
      <div class="section" style="left: 100px; top: 220px; width: 1240px; height: 80px"></div>
      <div class="section" style="left: 100px; top: 320px; width: 1240px; height: 120px"></div>
      <div class="section" style="left: 100px; top: 460px; width: 1240px; height: 600px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const baseWidth = 1440
const baseHeight = 1200

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

