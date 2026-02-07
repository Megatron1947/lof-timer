<template>
    <div
        class="w-screen h-screen transition-all duration-300"
        :data-theme="theme"
        :style="{backgroundColor: compact ? 'transparent' : ''}"
        id="app-container">
        <Navbar />
        <div v-if="compact" class="flex items-center justify-center h-full">
            <Countdown />
        </div>
        <div v-else class="drawer drawer-end">
            <input id="drawer" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex flex-col items-center justify-center">
                <!-- 状态文字 -->
                <div
                    class="text-base-content/80 text-3xl font-medium my-14 transition-all duration-300 text-center">
                    {{ status }}
                </div>

                <!-- 环形进度条 -->
                <RadialProgress
                    :value="cycleProgress"
                    size="21rem"
                    thickness="0.1rem"
                    color="text-gray-400">
                    <RadialProgress
                        :value="progress"
                        size="21rem"
                        thickness="1rem"
                        color="text-primary">
                        <!-- 倒计时 -->
                        <Countdown />
                    </RadialProgress>
                </RadialProgress>

                <!-- 底部按钮 -->
                <div class="mt-14 flex gap-4">
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
                        class="drawer-button btn btn-secondary min-w-24 h-12 transition-all duration-300">
                        设置
                    </label>
                </div>
            </div>
            <div class="drawer-side mt-12 z-20">
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
import {LogicalSize, Window} from '@tauri-apps/api/window'
import Settings from '@/components/Settings.vue'
import Navbar from '@/components/Navbar.vue'
import Countdown from '@/components/Countdown.vue'
import RadialProgress from '@/components/RadialProgress.vue'

const timerStore = useTimerStore()
const {
    status,
    previousStatus,
    formattedTime,
    isTimerRunning,
    remainingSeconds,
    focusTime,
    breakTime,
    totalCycles,
    currentCycle,
    theme,
    compact,
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

// 监听精简模式变化并调整窗口大小
watch(compact, async (isCompact) => {
    if (isCompact) {
        await appWindow.setSize(new LogicalSize({width: 280, height: 160}))
        await appWindow.setAlwaysOnTop(true)
    } else {
        await appWindow.setSize(new LogicalSize({width: 380, height: 680}))
        await appWindow.setAlwaysOnTop(false)
    }
})

const startTimer = timerStore.startTimer
const pauseTimer = timerStore.pauseTimer
const resetRuntime = timerStore.resetRuntime

onMounted(async () => {
    await timerStore.initConfig()
    const appContainer = document.getElementById('app-container')
    if (!appContainer) {
        return
    }
    appContainer.addEventListener('mousedown', (e) => {
        const target = e.target as HTMLElement
        const isInteractive =
            target.closest('button')
            || target.closest('input')
            || target.closest('select')
            || target.closest('label')
        if (!isInteractive && e.buttons === 1) {
            appWindow.startDragging()
        }
    })
})
</script>
