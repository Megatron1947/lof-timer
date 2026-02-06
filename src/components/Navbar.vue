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
            <button class="btn btn-ghost btn-circle mx-1" @click="minimize">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M16.59 8.59L12 13.17L7.41 8.59L6 10l6 6l6-6z"
                        fill="currentColor"></path>
                </svg>
            </button>
            <button class="btn btn-ghost btn-circle mx-1" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                        fill="currentColor"></path>
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
