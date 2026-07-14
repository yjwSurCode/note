// Type shim for vue-router to fix TypeScript resolution with pnpm
declare module 'vue-router' {
  export * from 'vue-router/dist/vue-router.d.mts'
}

