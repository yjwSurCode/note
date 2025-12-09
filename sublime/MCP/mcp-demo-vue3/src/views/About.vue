<template>
  <div class="about">
    <h1>About Page</h1>
    <p>This is the about page using Vue Router</p>
    <div class="info">
      <h2>技术栈</h2>
      <ul>
        <li>Vue 3</li>
        <li>TypeScript</li>
        <li>Pinia (状态管理)</li>
        <li>Vue Router (路由)</li>
        <li>Sass (样式预处理器)</li>
        <li>Fetch API (HTTP 请求)</li>
        <li>ESLint + Prettier (代码规范)</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// About page
</script>

<style scoped lang="scss">
.about {
  padding: 2rem;
  text-align: center;

  h1 {
    color: #646cff;
    margin-bottom: 1rem;
  }

  .info {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: #f5f5f5;
    border-radius: 8px;
    text-align: left;
    display: inline-block;

    h2 {
      color: #42b883;
      margin-top: 0;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #e0e0e0;

        &:last-child {
          border-bottom: none;
        }

        &::before {
          content: '✓ ';
          color: #42b883;
          font-weight: bold;
          margin-right: 0.5rem;
        }
      }
    }
  }
}
</style>

