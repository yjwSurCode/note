<template>
  <div class="fetch-demo">
    <h1>Fetch API 示例</h1>

    <div class="demo-section">
      <h2>GET 请求示例</h2>
      <button @click="handleGetRequest" :disabled="loading">
        {{ loading ? 'Loading...' : '获取 GitHub Zen' }}
      </button>
      <div v-if="result" class="result success">
        <p><strong>结果:</strong></p>
        <p>{{ result }}</p>
      </div>
      <div v-if="error" class="result error">
        <p><strong>错误:</strong></p>
        <p>{{ error }}</p>
      </div>
    </div>

    <div class="demo-section">
      <h2>POST 请求示例</h2>
      <div class="form-group">
        <input v-model="postData" type="text" placeholder="输入数据" />
        <button @click="handlePostRequest" :disabled="loading">
          {{ loading ? 'Sending...' : '发送 POST 请求' }}
        </button>
      </div>
      <div v-if="postResult" class="result success">
        <p><strong>响应:</strong></p>
        <pre>{{ JSON.stringify(postResult, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getText, post, type FetchError } from '../utils/fetch'

const loading = ref(false)
const result = ref('')
const error = ref('')
const postData = ref('Hello from Vue 3!')
const postResult = ref<any>(null)

async function handleGetRequest() {
  loading.value = true
  result.value = ''
  error.value = ''

  try {
    const data = await getText('https://httpbin.org/robots.txt', {
      timeout: 5000,
    })
    result.value = data || 'Success!'
  } catch (err) {
    const fetchError = err as FetchError
    error.value = fetchError.isTimeout
      ? '请求超时'
      : fetchError.message || '请求失败'
  } finally {
    loading.value = false
  }
}

async function handlePostRequest() {
  loading.value = true
  postResult.value = null
  error.value = ''

  try {
    // 使用 JSONPlaceholder 作为测试 API
    const data = await post('https://jsonplaceholder.typicode.com/posts', {
      title: postData.value,
      body: 'This is a test post',
      userId: 1,
    })
    postResult.value = data
  } catch (err) {
    const fetchError = err as FetchError
    error.value = fetchError.message || 'POST 请求失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.fetch-demo {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;

  h1 {
    color: #42b883;
    text-align: center;
    margin-bottom: 2rem;
  }

  .demo-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;

    h2 {
      margin-top: 0;
      color: #646cff;
    }

    button {
      padding: 0.75rem 1.5rem;
      background-color: #42b883;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;

      &:hover:not(:disabled) {
        background-color: #35a372;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .form-group {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;

      input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
    }

    .result {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 4px;

      &.success {
        background-color: #e8f5e9;
        border-left: 4px solid #4caf50;
      }

      &.error {
        background-color: #ffebee;
        border-left: 4px solid #f44336;
        color: #c62828;
      }

      pre {
        margin: 0.5rem 0 0 0;
        background-color: white;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
      }
    }
  }
}
</style>

