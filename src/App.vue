<template>
    <div
        class="w-screen h-screen"
        :class="{'overflow-hidden': compact}"
        :data-theme="theme"
        :style="{backgroundColor: compact ? 'transparent' : ''}"
        id="app-container">
        <Navbar />
        <div v-if="!initialized" class="flex flex-col items-center justify-center h-full">
            <div v-if="compact" class="flex items-center justify-center h-full pb-3">
                <div class="skeleton h-20 w-48 rounded-lg"></div>
            </div>
            <div v-else class="flex flex-col items-center justify-center">
                <div class="skeleton h-8 w-24 mb-18"></div>
                <div class="skeleton h-80 w-80 rounded-full mb-18"></div>
                <div class="flex gap-4">
                    <div class="skeleton h-14 w-14 rounded-full"></div>
                    <div class="skeleton h-14 w-14 rounded-full"></div>
                    <div class="skeleton h-14 w-14 rounded-full"></div>
                </div>
            </div>
        </div>
        <div v-else-if="compact" class="flex items-center justify-center h-full pb-3">
            <Countdown />
        </div>
        <div v-else class="drawer drawer-end">
            <input id="drawer" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex flex-col items-center justify-center">
                <!-- 状态文字 -->
                <div class="text-base-content/80 text-3xl font-medium my-18 text-center">
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
                <Buttons />
            </div>
            <div class="drawer-side mt-12 z-20">
                <label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                <Settings />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, watch} from 'vue'
import {storeToRefs} from 'pinia'
import {useTimerStore} from '@/stores/timerStore'
import {TimerStatus} from '@/types/timer'
import {LogicalSize, Window} from '@tauri-apps/api/window'
import Settings from '@/components/Settings.vue'
import Navbar from '@/components/Navbar.vue'
import Countdown from '@/components/Countdown.vue'
import RadialProgress from '@/components/RadialProgress.vue'
import Buttons from '@/components/Buttons.vue'

const timerStore = useTimerStore()
const {
    initialized,
    status,
    previousStatus,
    formattedTime,
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
    await nextTick()
    if (isCompact) {
        await appWindow.setSize(new LogicalSize({width: 280, height: 135}))
        await appWindow.setAlwaysOnTop(true)
        await appWindow.setSkipTaskbar(true)
    } else {
        await appWindow.setSize(new LogicalSize({width: 380, height: 680}))
        await appWindow.setAlwaysOnTop(false)
        await appWindow.setSkipTaskbar(false)
    }
})

onMounted(async () => {
    await nextTick()
    try {
        await appWindow.show()
        await appWindow.center()
        await appWindow.setFocus()
    } catch (error) {
        console.error('Failed to show window:', error)
    }
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
