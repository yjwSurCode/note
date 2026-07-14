<template>
  <div class="home">
    <h1>Home Page</h1>
    <p>Welcome to Vue 3 + Pinia + Vue Router + Fetch Demo</p>

    <div class="demo-section">
      <h2>Pinia Store 示例</h2>
      <div class="counter-demo">
        <p class="count-display">Count: {{ counterStore.count }}</p>
        <div class="buttons">
          <button @click="counterStore.increment">+</button>
          <button @click="counterStore.decrement">-</button>
          <button @click="counterStore.reset">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '../stores/counter'

const counterStore = useCounterStore()
</script>

<style scoped lang="scss">
.home {
  padding: 2rem;
  text-align: center;

  h1 {
    color: #42b883;
    margin-bottom: 1rem;
  }

  .demo-section {
    margin-top: 2rem;
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;

    h2 {
      margin-top: 0;
      color: #646cff;
    }

    .counter-demo {
      .count-display {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 1rem 0;
        color: #42b883;
      }

      .buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;

        button {
          padding: 0.5rem 1.5rem;
          font-size: 1.2rem;
          background-color: #646cff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background-color: #535bf2;
          }

          &:last-child {
            background-color: #f44336;

            &:hover {
              background-color: #d32f2f;
            }
          }
        }
      }
    }
  }
}
</style>

