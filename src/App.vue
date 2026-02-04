<template>
    <div class="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
        <!-- 状态文字 -->
        <div class="text-base-content/80 text-lg font-medium mb-8">
            {{ status }}
        </div>

        <!-- 环形进度条 -->
        <div class="flex items-center justify-center w-full max-w-sm">
            <!-- 外层环形 -->
            <div
                class="radial-progress text-base-300"
                :style="`--value: ${cycleProgress}; --size: 20rem; --thickness: 0.5rem`"
                role="progressbar"
                :aria-valuenow="cycleProgress"
                aria-valuemin="0"
                aria-valuemax="100">
                <!-- 内层环形 -->
                <div
                    class="radial-progress text-primary"
                    :style="`--value: ${progress}; --size: 16rem; --thickness: 0.5rem`"
                    role="progressbar"
                    :aria-valuenow="progress"
                    aria-valuemin="0"
                    aria-valuemax="100">
                    <!-- 中心双行文本 -->
                    <div class="flex flex-col items-center">
                        <span class="text-7xl font-bold">{{ formattedTime }}</span>
                        <span class="text-4xl opacity-60">{{ cycleText }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部按钮 -->
        <div class="mt-8 flex gap-4">
            <button
                v-if="!isTimerRunning"
                class="btn btn-primary min-w-24"
                @click="startTimer">
                {{ status === '暂停' ? '继续' : '启动' }}
            </button>
            <button
                v-else
                class="btn btn-warning min-w-24"
                @click="pauseTimer">
                暂停
            </button>
            <button class="btn btn-ghost min-w-24" @click="resetRuntime">重置</button>
            <button class="btn btn-ghost min-w-24" @click="showSettings = true">设置</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useTimerStore} from '@/stores/timerStore'
import {TimerStatus} from '@/types/timer'

const timerStore = useTimerStore()
const {
    status,
    formattedTime,
    cycleText,
    isTimerRunning,
    remainingSeconds,
    focusTime,
    breakTime,
    totalCycles,
    currentCycle,
} = storeToRefs(timerStore)

const showSettings = ref(false)

const progress = computed(() => {
    if (remainingSeconds.value <= 0) {
        return status.value === TimerStatus.READY || TimerStatus.FINISHED ? 0 : 100
    }
    const totalSeconds =
        status.value === TimerStatus.FOCUSING
            ? focusTime.value * 60
            : status.value === TimerStatus.BREAKING
              ? breakTime.value * 60
              : focusTime.value * 60
    const elapsed = totalSeconds - remainingSeconds.value
    return Math.round((elapsed / totalSeconds) * 100)
})

const cycleProgress = computed(() => {
    if (totalCycles.value <= 0) return 0
    const current = Math.min(currentCycle.value, totalCycles.value)
    return Math.round((current / totalCycles.value) * 100)
})

const startTimer = timerStore.startTimer
const pauseTimer = timerStore.pauseTimer
const resetRuntime = timerStore.resetRuntime

onMounted(() => {
    timerStore.initConfig()
})
</script>

<style scoped></style>
