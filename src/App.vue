<template>
    <div class="w-screen h-screen" :data-theme="currentTheme">
        <Navbar />
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
                        <RadialProgress
                            :value="cycleProgress"
                            size="21rem"
                            thickness="0.1rem"
                            color="text-gray-400">
                            <!-- 内层环形 -->
                            <RadialProgress
                                :value="progress"
                                size="21rem"
                                thickness="1rem"
                                color="text-primary">
                                <!-- 倒计时 -->
                                <Countdown />
                            </RadialProgress>
                        </RadialProgress>
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

onMounted(async () => {
    await timerStore.initConfig()
})
</script>

<style scoped></style>
