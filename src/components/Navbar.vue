<template>
    <div class="navbar-container group z-30">
        <div class="navbar min-h-10 max-h-10 pt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="navbar-start">
                <button
                    class="btn btn-ghost btn-circle"
                    v-if="isTimerRunning && devMode"
                    @click="timerStore.fastForward">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
                        <g>
                            <path
                                d="M13 10.697V6.131c0-1.36 1.57-2.118 2.636-1.273l9.636 7.641a1.917 1.917 0 0 1 0 3.004l-9.637 7.64c-1.065.845-2.634.086-2.634-1.273v-4.568l-7.366 5.84c-1.065.845-2.634.086-2.634-1.273V6.13c0-1.36 1.57-2.118 2.634-1.273l7.366 5.84zm0 4.691v-2.776l-8.297-6.58a.116.116 0 0 0-.064-.028a.132.132 0 0 0-.068.013a.132.132 0 0 0-.053.045a.116.116 0 0 0-.017.068v15.739c0 .034.008.054.017.068c.011.016.029.032.053.044a.131.131 0 0 0 .068.014a.116.116 0 0 0 .064-.028l8.298-6.579zm1.704-9.355a.116.116 0 0 0-.065-.028a.132.132 0 0 0-.068.013a.132.132 0 0 0-.053.045a.117.117 0 0 0-.017.068V21.87c0 .034.009.054.018.067c.01.017.028.033.052.045a.133.133 0 0 0 .068.014a.117.117 0 0 0 .065-.028l9.636-7.64a.417.417 0 0 0 0-.653l-9.636-7.642z"
                                fill="currentColor"></path>
                        </g>
                    </svg>
                </button>
            </div>
            <div class="navbar-center"></div>
            <div class="navbar-end">
                <button class="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <g>
                            <path
                                d="M26 30.75c0-.69.56-1.25 1.25-1.25h7.5a1.25 1.25 0 1 1 0 2.5h-7.5c-.69 0-1.25-.56-1.25-1.25zm-7-17.5a1.25 1.25 0 0 0-2.5 0V16h-3a1.25 1.25 0 1 0 0 2.5h3v2.75a1.25 1.25 0 1 0 2.5 0V18.5h2.75a1.25 1.25 0 1 0 0-2.5H19v-2.75zM24 44C12.954 44 4 35.046 4 24S12.954 4 24 4s20 8.954 20 20s-8.954 20-20 20zm0-2.5c9.665 0 17.5-7.835 17.5-17.5c0-4.383-1.611-8.389-4.273-11.46L12.54 37.228A17.432 17.432 0 0 0 24 41.5zm-13.227-6.04L35.46 10.772A17.432 17.432 0 0 0 24 6.5C14.335 6.5 6.5 14.335 6.5 24c0 4.383 1.611 8.389 4.273 11.46z"
                                fill="currentColor"></path>
                        </g>
                    </svg>
                </button>
                <button class="btn btn-ghost btn-circle" @click="minimize">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <g>
                            <path
                                d="M15.366 23.866a1.25 1.25 0 0 1 1.768 0l5.616 5.616V15.25a1.25 1.25 0 1 1 2.5 0v14.232l5.616-5.616a1.25 1.25 0 0 1 1.768 1.768l-7.75 7.75a1.25 1.25 0 0 1-1.768 0l-7.75-7.75a1.25 1.25 0 0 1 0-1.768zM4 24C4 12.954 12.954 4 24 4s20 8.954 20 20s-8.954 20-20 20S4 35.046 4 24zM24 6.5C14.335 6.5 6.5 14.335 6.5 24S14.335 41.5 24 41.5S41.5 33.665 41.5 24S33.665 6.5 24 6.5z"
                                fill="currentColor"></path>
                        </g>
                    </svg>
                </button>
                <button class="btn btn-ghost btn-circle" @click="close">
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
const {isTimerRunning} = storeToRefs(timerStore)

const devMode = import.meta.env.DEV
const window = new Window('main')

const minimize = async () => {
    await window.minimize()
}

const close = async () => {
    await window.close()
}
</script>

<style scoped>
.navbar-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4rem;
}
</style>
