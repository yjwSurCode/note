<template>
  <div class="figma-frame">
    <div class="hero-image"></div>
    <div class="title">Chinese Musicology Dictionary<br />connect · enpower · inherit</div>
    <div class="nav">
      <div class="nav-bg"></div>
      <div class="nav-links">
        <span>Home</span>
        <span>About</span>
        <span>Glossary</span>
      </div>
      <div class="nav-cta">Sign up / Log in</div>
    </div>
    <div class="section-card"></div>
    <div class="section-title">Musicology from Ancient to modern</div>
    <div class="section-right">
      <div class="section-right-title">400+ terms</div>
      <div class="section-right-body">All the translations are edited based on the Chinese Music Dictionary and billingual Chinese musicology journals, and proofread by the academic advisors. Welcome to contact us, give us advise to improve on our translation.</div>
    </div>
    <div class="footer">
      <div class="footer-bg"></div>
      <div class="footer-links">
        <span>Home</span>
        <span>About</span>
        <span>Contact</span>
      </div>
      <div class="footer-copy">©2020 Yourcompany</div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
</script>

<style scoped>
.figma-frame {
  position: relative;
  width: 1440px;
  height: 2083px;
  margin: 0 auto;
  background: #ffffff;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  left: 0px;
  top: 171px;
  width: 1440px;
  height: 372px;
  background: #d8d8d8;
}

.title {
  position: absolute;
  left: 101px;
  top: 294px;
  width: 617px;
  height: 148px;
  color: #141719;
  font-family: Georgia, serif;
  font-weight: 700;
  font-size: 38px;
  line-height: 66px;
  letter-spacing: 1px;
  text-align: center;
}

.nav {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 1440px;
  height: 64px;
}

.nav-bg {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 1440px;
  height: 64px;
  background: #d8d8d8;
}

.nav-links {
  position: absolute;
  left: 101px;
  top: 20px;
  display: flex;
  gap: 40px;
  color: #141719;
  font-family: Georgia, serif;
  font-weight: 500;
  font-size: 16px;
}

.nav-cta {
  position: absolute;
  right: 101px;
  top: 13px;
  padding: 8px 12px;
  background: #141719;
  color: #ffffff;
  border-radius: 2px;
  font-family: Georgia, serif;
  font-size: 14px;
}

.section-card {
  position: absolute;
  left: 815.76px;
  top: 318.31px;
  width: 535.06px;
  height: 32.03px;
  background: #ffffff;
  border: 1px solid #979797;
}

.section-title {
  position: absolute;
  left: 387px;
  top: 606px;
  width: 250px;
  height: 67px;
  color: #000000;
  font-family: Georgia, serif;
  font-weight: 700;
  font-size: 22px;
  line-height: 33px;
}

.section-right {
  position: absolute;
  left: 804.62px;
  top: 1105.06px;
  width: 349.61px;
  height: 185.18px;
}

.section-right-title {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 350px;
  height: 48px;
  color: #000000;
  font-family: Georgia, serif;
  font-weight: 700;
  font-size: 22px;
}

.section-right-body {
  position: absolute;
  left: 0px;
  top: 64px;
  width: 294px;
  height: 156px;
  color: #141719;
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 26px;
}

.footer {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 1440px;
  height: 120px;
}

.footer-bg {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 1440px;
  height: 120px;
  background: #f5f5f5;
}

.footer-links {
  position: absolute;
  left: 101px;
  top: 40px;
  display: flex;
  gap: 32px;
  color: #646cff;
  font-size: 14px;
}

.footer-copy {
  position: absolute;
  right: 101px;
  top: 40px;
  color: #646cff;
  font-size: 14px;
}
</style>
