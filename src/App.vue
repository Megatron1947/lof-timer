<template>
    <div class="drawer drawer-end">
        <input id="drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
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
                    <button v-else class="btn btn-warning min-w-24" @click="pauseTimer">
                        暂停
                    </button>
                    <button class="btn btn-ghost min-w-24" @click="resetRuntime">重置</button>
                    <!--                    <button class="btn btn-ghost min-w-24">设置</button>-->
                    <label for="drawer" class="drawer-button btn btn-primary">设置</label>
                </div>
            </div>
        </div>
        <div class="drawer-side">
            <label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="bg-base-200 w-80 p-6 min-h-screen">
                <div>
                    <h2 class="text-xl font-bold mb-6 text-primary">设置</h2>
                </div>
                <!-- 专注时间设置 -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <label class="text-sm font-medium">专注时间</label>
                        <span class="text-sm font-semibold">{{ focusTime }} 分钟</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="60"
                        :value="focusTime"
                        class="range range-primary"
                        @input="updateFocusTime($event)" />
                </div>
                <!-- 休息时间设置 -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <label class="text-sm font-medium">休息时间</label>
                        <span class="text-sm font-semibold">{{ breakTime }} 分钟</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="15"
                        :value="breakTime"
                        class="range range-primary"
                        @input="updateBreakTime($event)" />
                </div>
                <!-- 循环次数设置 -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <label class="text-sm font-medium">循环次数</label>
                        <span class="text-sm font-semibold">{{ totalCycles }} 次</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        :value="totalCycles"
                        class="range range-primary"
                        @input="updateTotalCycles($event)" />
                </div>
                <!-- 重置按钮 -->
                <div class="mt-8">
                    <button class="btn btn-ghost w-full" @click="resetConfig">
                        恢复默认设置
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue'
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

const progress = computed(() => {
    if (remainingSeconds.value <= 0) {
        return 0
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
    if (totalCycles.value <= 0) {
        return 0
    }
    const current = Math.min(currentCycle.value, totalCycles.value)
    return Math.round((current / totalCycles.value) * 100)
})

const startTimer = timerStore.startTimer
const pauseTimer = timerStore.pauseTimer
const resetRuntime = timerStore.resetRuntime
const resetConfig = timerStore.resetConfig
const saveConfig = timerStore.saveConfig

// 更新专注时间
const updateFocusTime = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = parseInt(target.value)
    saveConfig({focusTime: value})
}

// 更新休息时间
const updateBreakTime = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = parseInt(target.value)
    saveConfig({breakTime: value})
}

// 更新循环次数
const updateTotalCycles = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = parseInt(target.value)
    saveConfig({totalCycles: value})
}

onMounted(() => {
    timerStore.initConfig()
})
</script>

<style scoped></style>
