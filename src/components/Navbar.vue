<template>
    <div class="absolute top-0 left-0 right-0 h-16 group z-30">
        <div
            class="navbar min-h-10 max-h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            :class="compact ? 'pt-2 group-hover:bg-base-300/40 backdrop-blur-sm' : 'pt-5'">
            <div class="navbar-start">
                <!-- 重置 -->
                <button
                    class="btn btn-ghost btn-circle tooltip tooltip-info tooltip-bottom"
                    data-tip="重置"
                    v-if="compact"
                    @click="timerStore.resetRuntime">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g>
                            <path
                                d="M16 8.25a.75.75 0 0 1 1.5 0v3.25a.75.75 0 0 1-.75.75H14a.75.75 0 0 1 0-1.5h1.27A3.502 3.502 0 0 0 12 8.5c-1.093 0-2.037.464-2.673 1.23a.75.75 0 1 1-1.154-.96C9.096 7.66 10.463 7 12 7c1.636 0 3.088.785 4 2v-.75zM8 15v.75a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75H10a.75.75 0 0 1 0 1.5H8.837a3.513 3.513 0 0 0 5.842.765a.75.75 0 1 1 1.142.972A5.013 5.013 0 0 1 8 15zm4-13C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm8.5 10a8.5 8.5 0 1 1-17 0a8.5 8.5 0 0 1 17 0z"
                                fill="currentColor"></path>
                        </g>
                    </svg>
                </button>
                <!-- 开始/暂停 -->
                <button
                    class="btn btn-ghost btn-circle tooltip tooltip-info tooltip-bottom"
                    :data-tip="isTimerRunning ? '暂停' : '开始'"
                    v-if="compact"
                    @click="isTimerRunning ? timerStore.pauseTimer() : timerStore.startTimer()">
                    <template v-if="isTimerRunning">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g>
                                <path
                                    d="M10.5 8.25a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5zm4.5 0a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zM3.5 12a8.5 8.5 0 1 1 17 0a8.5 8.5 0 0 1-17 0z"
                                    fill="currentColor"></path>
                            </g>
                        </svg>
                    </template>
                    <template v-else>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <g>
                                <path
                                    d="M24 41.5c-9.665 0-17.5-7.835-17.5-17.5S14.335 6.5 24 6.5S41.5 14.335 41.5 24S33.665 41.5 24 41.5zM4 24c0 11.046 8.954 20 20 20s20-8.954 20-20S35.046 4 24 4S4 12.954 4 24zm16.366 8.616a1.25 1.25 0 0 0 1.768 1.768l9.5-9.5a1.25 1.25 0 0 0 0-1.768l-9.5-9.5a1.25 1.25 0 0 0-1.768 1.768L28.982 24l-8.616 8.616z"
                                    fill="currentColor"></path>
                            </g>
                        </svg>
                    </template>
                </button>
                <!-- 快进 -->
                <button
                    class="btn btn-ghost btn-circle tooltip tooltip-info tooltip-bottom"
                    data-tip="快进"
                    v-if="isTimerRunning && devMode"
                    @click="timerStore.fastForward">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <g>
                            <path
                                d="M32.39 11.608a5.36 5.36 0 0 1 1.295 2.106l.846 2.6a1.027 1.027 0 0 0 1.938 0l.846-2.6a5.357 5.357 0 0 1 3.397-3.394l2.602-.845a1.028 1.028 0 0 0 0-1.937l-.052-.013l-2.602-.845a5.362 5.362 0 0 1-3.397-3.394l-.846-2.6a1.027 1.027 0 0 0-1.939 0l-.845 2.6l-.022.064a5.357 5.357 0 0 1-3.322 3.33l-2.603.845a1.028 1.028 0 0 0 0 1.937l2.602.845a5.36 5.36 0 0 1 2.103 1.301zm13.841 6.928l1.378.448l.028.007a.544.544 0 0 1 0 1.025l-1.378.448a2.84 2.84 0 0 0-1.798 1.796l-.448 1.377a.504.504 0 0 1-.016.04v.009a.544.544 0 0 1-1.01-.039l-.448-1.377a2.837 2.837 0 0 0-1.357-1.61l-.003-.015a2.844 2.844 0 0 0-.438-.188l-1.378-.448a.544.544 0 0 1 0-1.025l1.378-.448a2.839 2.839 0 0 0 1.77-1.796l.448-1.377a.544.544 0 0 1 1.027 0l.448 1.377a2.834 2.834 0 0 0 1.797 1.796zM25.682 6.58A17.714 17.714 0 0 0 24 6.5C14.335 6.5 6.5 14.335 6.5 24S14.335 41.5 24 41.5c9.332 0 16.957-7.304 17.472-16.507a2.543 2.543 0 0 0 2.432.978C42.914 36.09 34.381 44 24 44C12.954 44 4 35.046 4 24S12.954 4 24 4c1.948 0 3.83.278 5.61.797l-2.542.826a3.045 3.045 0 0 0-1.386.957zM20 19.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0zM30.5 22a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5zM18.452 34.681A11.718 11.718 0 0 0 24 36a11.718 11.718 0 0 0 9.816-5.1a1.249 1.249 0 1 0-2.13-1.307A9.212 9.212 0 0 1 24 33.5a9.22 9.22 0 0 1-7.687-3.907a1.248 1.248 0 1 0-2.13 1.307a11.718 11.718 0 0 0 4.269 3.781z"
                                fill="currentColor"></path>
                        </g>
                    </svg>
                </button>
            </div>
            <div class="navbar-center"></div>
            <div class="navbar-end">
                <!-- 切换模式 -->
                <button
                    class="btn btn-ghost btn-circle tooltip tooltip-info tooltip-bottom"
                    data-tip="切换模式"
                    @click="toggleCompact">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <g>
                            <path
                                d="M26 30.75c0-.69.56-1.25 1.25-1.25h7.5a1.25 1.25 0 1 1 0 2.5h-7.5c-.69 0-1.25-.56-1.25-1.25zm-7-17.5a1.25 1.25 0 0 0-2.5 0V16h-3a1.25 1.25 0 1 0 0 2.5h3v2.75a1.25 1.25 0 1 0 2.5 0V18.5h2.75a1.25 1.25 0 1 0 0-2.5H19v-2.75zM24 44C12.954 44 4 35.046 4 24S12.954 4 24 4s20 8.954 20 20s-8.954 20-20 20zm0-2.5c9.665 0 17.5-7.835 17.5-17.5c0-4.383-1.611-8.389-4.273-11.46L12.54 37.228A17.432 17.432 0 0 0 24 41.5zm-13.227-6.04L35.46 10.772A17.432 17.432 0 0 0 24 6.5C14.335 6.5 6.5 14.335 6.5 24c0 4.383 1.611 8.389 4.273 11.46z"
                                fill="currentColor"></path>
                        </g>
                    </svg>
                </button>
                <!-- 最小化 -->
                <button
                    class="btn btn-ghost btn-circle tooltip tooltip-info tooltip-bottom"
                    data-tip="最小化"
                    @click="minimize">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <g>
                            <path
                                d="M15.366 23.866a1.25 1.25 0 0 1 1.768 0l5.616 5.616V15.25a1.25 1.25 0 1 1 2.5 0v14.232l5.616-5.616a1.25 1.25 0 0 1 1.768 1.768l-7.75 7.75a1.25 1.25 0 0 1-1.768 0l-7.75-7.75a1.25 1.25 0 0 1 0-1.768zM4 24C4 12.954 12.954 4 24 4s20 8.954 20 20s-8.954 20-20 20S4 35.046 4 24zM24 6.5C14.335 6.5 6.5 14.335 6.5 24S14.335 41.5 24 41.5S41.5 33.665 41.5 24S33.665 6.5 24 6.5z"
                                fill="currentColor"></path>
                        </g>
                    </svg>
                </button>
                <!-- 关闭 -->
                <button
                    class="btn btn-ghost btn-circle tooltip tooltip-info tooltip-bottom"
                    data-tip="关闭"
                    @click="close">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <g>
                            <path
                                d="M24 4c11.046 0 20 8.954 20 20s-8.954 20-20 20S4 35.046 4 24S12.954 4 24 4zm0 2.5C14.335 6.5 6.5 14.335 6.5 24S14.335 41.5 24 41.5S41.5 33.665 41.5 24S33.665 6.5 24 6.5zm-6.218 9.525l.102.091L24 22.233l6.116-6.117a1.25 1.25 0 0 1 1.666-.091l.102.091a1.25 1.25 0 0 1 .091 1.666l-.091.102L25.767 24l6.117 6.116a1.25 1.25 0 0 1 .091 1.666l-.091.102a1.25 1.25 0 0 1-1.666.091l-.102-.091L24 25.767l-6.116 6.117a1.25 1.25 0 0 1-1.666.091l-.102-.091a1.25 1.25 0 0 1-.091-1.666l.091-.102L22.233 24l-6.117-6.116a1.25 1.25 0 0 1-.091-1.666l.091-.102a1.25 1.25 0 0 1 1.666-.091z"
                                fill="currentColor"></path>
                        </g>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useTimerStore} from '@/stores/timerStore.ts'
import {storeToRefs} from 'pinia'
import {Window} from '@tauri-apps/api/window'

const timerStore = useTimerStore()
const {isTimerRunning, compact} = storeToRefs(timerStore)

const devMode = import.meta.env.DEV
const window = new Window('main')

const minimize = async () => {
    await window.minimize()
}

const close = async () => {
    await window.close()
}

const toggleCompact = async () => {
    await timerStore.toggleCompact()
}
</script>

<style scoped></style>
