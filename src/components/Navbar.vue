<template>
    <div class="navbar min-h-10 max-h-10 pt-5 z-30">
        <div class="navbar-start">
            <button
                class="btn btn-ghost btn-circle mx-1"
                v-if="isTimerRunning && devMode"
                @click="timerStore.fastForward">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M15 9.86L18.03 12L15 14.14V9.86m-9 0L9.03 12L6 14.14V9.86M13 6v12l8.5-6L13 6zM4 6v12l8.5-6L4 6z"
                        fill="currentColor"></path>
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
