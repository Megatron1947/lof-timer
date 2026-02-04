<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div class="bg-[#F0FDF4]">
            <div class="timer-container">
                <div class="status-row">
                    <span class="status-text">{{ store.status }}</span>
                </div>

                <div class="timer-row">
                    <div class="progress-circle">
                        <n-progress
                            type="multiple-circle"
                            :percentage="[cycleProgress, progressPercentage]"
                            :color="['#16A34A', statusColor]"
                            :rail-style="[
                                {stroke: '#DCFCE7', opacity: 1},
                                {stroke: '#F3F4F6', opacity: 1},
                            ]"
                            :stroke-width="10"
                            :circle-gap="0"
                            :size="450">
                            <div class="timer-content">
                                <div class="time-text">{{ store.formattedTime }}</div>
                                <div class="cycle-text">
                                    {{ store.currentCycle }}/{{ store.totalCycles }}
                                </div>
                            </div>
                        </n-progress>
                    </div>
                </div>

                <div class="button-row">
                    <n-button
                        :type="store.isTimerRunning ? 'warning' : 'primary'"
                        size="medium"
                        round
                        @click="handleStartPause">
                        {{
                            store.isTimerRunning
                                ? '暂停'
                                : store.status === TimerStatus.PAUSED
                                  ? '继续'
                                  : '开始'
                        }}
                    </n-button>
                    <n-button size="medium" round @click="store.resetRuntime">重置</n-button>
                    <n-button size="medium" round @click="drawerVisible = true">设置</n-button>
                </div>
            </div>

            <n-drawer v-model:show="drawerVisible" :width="280" placement="right">
                <n-drawer-content title="设置" closable>
                    <div class="setting-item">
                        <div class="setting-label">
                            <span>专注时间</span>
                            <span>{{ store.focusTime }}分钟</span>
                        </div>
                        <n-slider
                            v-model:value="store.focusTime"
                            :min="1"
                            :max="60"
                            :step="1"
                            :tooltip="false"
                            @update:value="handleConfigChange" />
                    </div>
                    <div class="setting-item">
                        <div class="setting-label">
                            <span>休息时间</span>
                            <span>{{ store.breakTime }}分钟</span>
                        </div>
                        <n-slider
                            v-model:value="store.breakTime"
                            :min="1"
                            :max="30"
                            :step="1"
                            :tooltip="false"
                            @update:value="handleConfigChange" />
                    </div>
                    <div class="setting-item">
                        <div class="setting-label">
                            <span>循环次数</span>
                            <span>{{ store.totalCycles }}</span>
                        </div>
                        <n-slider
                            v-model:value="store.totalCycles"
                            :min="1"
                            :max="10"
                            :step="1"
                            :tooltip="false"
                            @update:value="handleConfigChange" />
                    </div>
                </n-drawer-content>
            </n-drawer>
        </div>
    </n-config-provider>
</template>

<script setup lang="ts">
import {computed, ref, watchEffect} from 'vue'
import {TimerStatus} from '@/types/timer'
import {useTimerStore} from '@/stores/timerStore'
import {getCurrentWindow} from '@tauri-apps/api/window'

const store = useTimerStore()
const drawerVisible = ref(false)
const appWindow = getCurrentWindow()

// 动态窗口标题
const windowTitle = computed(() => {
    if (store.status === TimerStatus.PAUSED) {
        return `暂停 - ${store.formattedTime}`
    }
    if (store.status === TimerStatus.FOCUSING) {
        return `专注中 - ${store.formattedTime}`
    }
    if (store.status === TimerStatus.BREAKING) {
        return `休息中 - ${store.formattedTime}`
    }
    return 'lof-timer'
})

const themeOverrides = {
    common: {
        primaryColor: '#22C55E',
        primaryColorHover: '#10B981',
        primaryColorPressed: '#16A34A',
        primaryColorSuppl: '#86EFAC',
    },
    Button: {
        fontWeight: '500',
        heightMedium: '36px',
    },
}

const statusColor = computed(() => {
    switch (store.status) {
        case TimerStatus.FOCUSING:
            return '#22C55E'
        case TimerStatus.BREAKING:
            return '#38BDF8'
        case TimerStatus.PAUSED:
            return '#FBBF24'
        case TimerStatus.FINISHED:
            return '#8B5CF6'
        case TimerStatus.READY:
            return '#86EFAC'
        default:
            return '#86EFAC'
    }
})

const totalSeconds = computed(() => {
    const status = store.status === TimerStatus.PAUSED ? store.previousStatus : store.status
    if (store.status === TimerStatus.READY || !status) {
        return 0
    }
    return (status === TimerStatus.FOCUSING ? store.focusTime : store.breakTime) * 60
})

const progressPercentage = computed(() => {
    if (totalSeconds.value === 0) {
        return 100
    }
    return Math.round((store.remainingSeconds / totalSeconds.value) * 100)
})

const cycleProgress = computed(() => {
    if (store.totalCycles === 0) {
        return 0
    }
    return Math.round((store.currentCycle / store.totalCycles) * 100)
})

const handleStartPause = () => {
    if (
        store.status === TimerStatus.READY
        || store.status === TimerStatus.PAUSED
        || store.status === TimerStatus.FINISHED
    ) {
        store.startTimer()
    } else {
        store.pauseTimer()
    }
}

const handleConfigChange = () => {
    store.saveConfig({
        focusTime: store.focusTime,
        breakTime: store.breakTime,
        totalCycles: store.totalCycles,
    })
}

// 监听标题变化，实时更新
watchEffect(() => {
    if (appWindow) {
        appWindow.setTitle(windowTitle.value)
    }
})
</script>

<style scoped>
.timer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;
    min-height: 100vh;
    box-sizing: border-box;
}

.status-row {
    margin-bottom: 16px;
}

.status-text {
    font-size: 20px;
    color: #34d399;
}

.timer-row {
    margin-bottom: 16px;
}

.progress-circle {
    width: 450px;
    height: 450px;
    overflow: hidden;
}

.progress-circle :deep(.n-progress),
.progress-circle :deep(.n-progress-content),
.progress-circle :deep(.n-progress-graph),
.progress-circle :deep(.n-progress-graph-circle),
.progress-circle :deep(svg) {
    width: 100% !important;
    height: 100% !important;
}

.timer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.time-text {
    font-size: 64px;
    font-weight: 700;
    color: #15803d;
    letter-spacing: 2px;
}

.cycle-text {
    font-size: 20px;
    font-weight: 500;
    color: #34d399;
    margin-top: 8px;
}

.button-row {
    display: flex;
    gap: 8px;
    width: 100%;
    max-width: 288px;
    justify-content: center;
}

.setting-item {
    margin-bottom: 20px;
}

.setting-label {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #34d399;
    margin-bottom: 8px;
}

.setting-label span:last-child {
    color: #15803d;
    font-weight: 600;
}
</style>
