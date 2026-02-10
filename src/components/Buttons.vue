<template>
    <div class="mt-18 flex gap-4">
        <!-- 重置 -->
        <button
            class="btn btn-ghost btn-circle w-18 h-18"
            @click="timerStore.resetRuntime">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g>
                    <path
                        d="M16 8.25a.75.75 0 0 1 1.5 0v3.25a.75.75 0 0 1-.75.75H14a.75.75 0 0 1 0-1.5h1.27A3.502 3.502 0 0 0 12 8.5c-1.093 0-2.037.464-2.673 1.23a.75.75 0 1 1-1.154-.96C9.096 7.66 10.463 7 12 7c1.636 0 3.088.785 4 2v-.75zM8 15v.75a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75H10a.75.75 0 0 1 0 1.5H8.837a3.513 3.513 0 0 0 5.842.765a.75.75 0 1 1 1.142.972A5.013 5.013 0 0 1 8 15zm4-13C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm8.5 10a8.5 8.5 0 1 1-17 0a8.5 8.5 0 0 1 17 0z"
                        fill="currentColor"></path>
                </g>
            </svg>
        </button>
        <!-- 暂停 -->
        <button
            v-if="isTimerRunning"
            class="btn btn-ghost btn-circle w-18 h-18"
            @click="timerStore.pauseTimer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g>
                    <path
                        d="M10.5 8.25a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5zm4.5 0a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zM3.5 12a8.5 8.5 0 1 1 17 0a8.5 8.5 0 0 1-17 0z"
                        fill="currentColor"></path>
                </g>
            </svg>
        </button>
        <!-- 开始 -->
        <button
            v-else
            class="btn btn-ghost btn-circle w-18 h-18"
            @click="timerStore.startTimer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <g>
                    <path
                        d="M24 41.5c-9.665 0-17.5-7.835-17.5-17.5S14.335 6.5 24 6.5S41.5 14.335 41.5 24S33.665 41.5 24 41.5zM4 24c0 11.046 8.954 20 20 20s20-8.954 20-20S35.046 4 24 4S4 12.954 4 24zm16.366 8.616a1.25 1.25 0 0 0 1.768 1.768l9.5-9.5a1.25 1.25 0 0 0 0-1.768l-9.5-9.5a1.25 1.25 0 0 0-1.768 1.768L28.982 24l-8.616 8.616z"
                        fill="currentColor"></path>
                </g>
            </svg>
        </button>
        <!-- 设置 -->
        <label
            for="drawer"
            class="drawer-button btn btn-ghost btn-circle w-18 h-18 scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><g fill="none"><path d="M10 18a2 2 0 1 0 0-4a2 2 0 0 0 0 4zm6 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4zm8-2a2 2 0 1 1-4 0a2 2 0 0 1 4 0zm6 0c0 7.732-6.268 14-14 14S2 23.732 2 16S8.268 2 16 2s14 6.268 14 14zm-2 0c0-6.627-5.373-12-12-12S4 9.373 4 16s5.373 12 12 12s12-5.373 12-12z" fill="currentColor"></path></g></svg>
        </label>
    </div>
</template>

<script setup lang="ts">
import {useTimerStore} from '@/stores/timerStore.ts'
import {storeToRefs} from 'pinia'

const timerStore = useTimerStore()
const {isTimerRunning} = storeToRefs(timerStore)
</script>

<style scoped></style>
