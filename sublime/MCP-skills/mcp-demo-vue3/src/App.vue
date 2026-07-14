<script setup lang="ts">
// @ts-ignore - vue-router types issue with pnpm
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const a = ref()

const b = () => {
  console.log('b')
}

console.log(b, 'b')
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="logo">Vue 3 Demo</h1>
        <div class="nav-links">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/fetch-demo">Fetch Demo</RouterLink>
          <RouterLink to="/figma">Figma</RouterLink>
          <RouterLink to="/figma-research">Research</RouterLink>
          <RouterLink to="/figma-ux">UX</RouterLink>
          <RouterLink to="/figma-ui">UI</RouterLink>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
      margin: 0;
      font-size: 1.5rem;
      color: #42b883;
    }

    .nav-links {
      display: flex;
      gap: 2rem;

      a {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.3s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &.router-link-active {
          background-color: #42b883;
          color: white;
        }
      }
    }
  }
}

.main-content {
  flex: 1;
  background-color: #f5f5f5;
}
</style>
