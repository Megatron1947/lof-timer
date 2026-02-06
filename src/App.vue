<template>
    <div class="w-full h-full" :data-theme="currentTheme">
        <div class="navbar min-h-10 max-h-10">
            <div class="navbar-start gap-1">
                <svg
                    width="25"
                    height="25"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </g>
                </svg>
                <svg
                    width="25"
                    height="25"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path
                            d="M12 9V5.414a1 1 0 0 1 1.707-.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586A1 1 0 0 1 12 18.586V15H9V9h3z"></path>
                        <path d="M3 9v6"></path>
                        <path d="M6 9v6"></path>
                    </g>
                </svg>
            </div>
            <div class="navbar-center"></div>
            <div class="navbar-end">
                <svg
                    width="25"
                    height="25"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M15 19v-2a2 2 0 0 1 2-2h2"></path>
                        <path d="M15 5v2a2 2 0 0 0 2 2h2"></path>
                        <path d="M5 15h2a2 2 0 0 1 2 2v2"></path>
                        <path d="M5 9h2a2 2 0 0 0 2-2V5"></path>
                    </g>
                </svg>
                <svg
                    width="25"
                    height="25"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <g
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M18 6L6 18"></path>
                        <path d="M6 6l12 12"></path>
                    </g>
                </svg>
            </div>
        </div>
        <div class="drawer drawer-end">
            <input id="drawer" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content">
                <div class="place-content-center place-items-center">
                    <!-- 状态文字 -->
                    <div
                        class="text-base-content/80 text-3xl font-medium mt-8 mb-8 transition-all duration-300">
                        {{ status }}
                    </div>

                    <!-- 环形进度条 -->
                    <div>
                        <!-- 外层环形 -->
                        <div
                            class="radial-progress text-gray-400"
                            :style="`--value: ${cycleProgress}; --size: 21rem; --thickness: 0.1rem`"
                            role="progressbar"
                            :aria-valuenow="cycleProgress"
                            aria-valuemin="0"
                            aria-valuemax="100">
                            <!-- 内层环形 -->
                            <div
                                class="radial-progress text-primary"
                                :style="`--value: ${progress}; --size: 21rem; --thickness: 1rem`"
                                role="progressbar"
                                :aria-valuenow="progress"
                                aria-valuemin="0"
                                aria-valuemax="100">
                                <!-- 中心双行文本 -->
                                <div class="flex flex-col items-center font-mono">
                                    <div
                                        class="flex items-center text-8xl font-bold text-primary transition-all duration-300">
                                        <span class="countdown">
                                            <span
                                                :style="{
                                                    '--value': Math.floor(
                                                        remainingSeconds / 60,
                                                    ),
                                                    '--digits': 2,
                                                }"
                                                aria-live="polite"
                                                >{{
                                                    Math.floor(remainingSeconds / 60)
                                                        .toString()
                                                        .padStart(2, '0')
                                                }}</span
                                            >
                                        </span>
                                        <span>:</span>
                                        <span class="countdown">
                                            <span
                                                :style="{
                                                    '--value': remainingSeconds % 60,
                                                    '--digits': 2,
                                                }"
                                                aria-live="polite"
                                                >{{
                                                    (remainingSeconds % 60)
                                                        .toString()
                                                        .padStart(2, '0')
                                                }}</span
                                            >
                                        </span>
                                    </div>
                                    <span
                                        class="text-4xl text-base-content/60 transition-all duration-300"
                                        >{{ cycleText }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 底部按钮 -->
                    <div class="mt-8 flex gap-4">
                        <button
                            class="btn btn-dash min-w-24 h-12 transition-all duration-300"
                            @click="resetRuntime">
                            重置
                        </button>
                        <button
                            v-if="!isTimerRunning"
                            class="btn btn-primary min-w-24 h-12 transition-all duration-300"
                            @click="startTimer">
                            {{ status === '暂停' ? '继续' : '启动' }}
                        </button>
                        <button
                            v-else
                            class="btn btn-warning min-w-24 h-12 transition-all duration-300"
                            @click="pauseTimer">
                            暂停
                        </button>
                        <label
                            for="drawer"
                            class="drawer-button btn btn-secondary min-w-24 h-12 transition-all duration-300"
                            >设置</label
                        >
                    </div>
                    <div class="mt-8 flex gap-4 h-12">
                        <button
                            v-if="isTimerRunning && devMode"
                            class="btn btn-info min-w-24 h-full transition-all duration-300"
                            @click="fastForwardTimer">
                            快速结束
                        </button>
                    </div>
                </div>
            </div>
            <div class="drawer-side">
                <label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                <Settings />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, watch} from 'vue'
import {storeToRefs} from 'pinia'
import {useTimerStore} from '@/stores/timerStore'
import {TimerStatus} from '@/types/timer'
import {Window} from '@tauri-apps/api/window'
import Settings from '@/components/Settings.vue'

const timerStore = useTimerStore()
const {
    status,
    previousStatus,
    formattedTime,
    cycleText,
    isTimerRunning,
    remainingSeconds,
    focusTime,
    breakTime,
    totalCycles,
    currentCycle,
    currentTheme,
} = storeToRefs(timerStore)

const progress = computed(() => {
    if (remainingSeconds.value <= 0) {
        return 0
    }
    const currentStatus =
        status.value === TimerStatus.PAUSED ? previousStatus.value : status.value
    const totalSeconds =
        currentStatus === TimerStatus.FOCUSING
            ? focusTime.value * 60
            : currentStatus === TimerStatus.BREAKING
              ? breakTime.value * 60
              : focusTime.value * 60
    const elapsed = totalSeconds - remainingSeconds.value
    return Math.round((elapsed / totalSeconds) * 100)
})

const cycleProgress = computed(() => {
    if (totalCycles.value <= 0) {
        return 0
    }
    const current = Math.min(currentCycle.value, totalCycles.value)
    return Math.round((current / totalCycles.value) * 100)
})

const windowTitle = computed(() => {
    switch (status.value) {
        case TimerStatus.PAUSED:
            return '暂停'
        case TimerStatus.FOCUSING:
            return `专注中 ${formattedTime.value}`
        case TimerStatus.BREAKING:
            return `休息中 ${formattedTime.value}`
        default:
            return 'lof-timer'
    }
})

// 创建主窗口实例
const appWindow = new Window('main')

// 监听窗口标题变化并更新
watch(
    windowTitle,
    async (newTitle) => {
        await appWindow.setTitle(newTitle)
    },
    {immediate: true},
)

const startTimer = timerStore.startTimer
const pauseTimer = timerStore.pauseTimer
const resetRuntime = timerStore.resetRuntime
const fastForwardTimer = timerStore.fastForwardTimer

const devMode = import.meta.env.DEV

onMounted(async () => {
    await timerStore.initConfig()
})
</script>

<style scoped></style>
