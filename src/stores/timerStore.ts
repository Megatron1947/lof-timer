import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {TimerConfig, TimerStatus} from '@/types/timer'
import {
    loadConfig,
    saveConfig as saveConfigService,
    setAutoStart,
    DEFAULT_CONFIG,
} from '@/services/configService'
import {useTimerLogic, onAllCycleFinished} from '@/composables/useTimerLogic'

export const useTimerStore = defineStore('timer', () => {
    const focusTime = ref(DEFAULT_CONFIG.focusTime)
    const breakTime = ref(DEFAULT_CONFIG.breakTime)
    const totalCycles = ref(DEFAULT_CONFIG.totalCycles)
    const theme = ref(DEFAULT_CONFIG.theme)
    const compact = ref(false)
    const autoStart = ref(false)

    const status = ref<TimerStatus>(TimerStatus.READY)
    const previousStatus = ref<TimerStatus | null>(null)
    const currentCycle = ref(0)
    const remainingSeconds = ref(0)
    const timerId = ref<number | null>(null)

    const formattedTime = computed(() => {
        const minutes = Math.floor(remainingSeconds.value / 60)
        const seconds = remainingSeconds.value % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    const cycleText = computed(() => {
        return `${currentCycle.value}/${totalCycles.value}`
    })

    const isAllCycleFinished = computed(() => {
        return currentCycle.value >= totalCycles.value
    })

    const isTimerRunning = computed(() => {
        return status.value === TimerStatus.FOCUSING || status.value === TimerStatus.BREAKING
    })

    const {countdownHandler} = useTimerLogic({
        status,
        remainingSeconds,
        focusTime,
        breakTime,
        currentCycle,
        isTimerRunning,
        isAllCycleFinished,
        onAllCycleFinishedCallback: onAllCycleFinished,
    })

    const initConfig = async () => {
        const config = await loadConfig()
        focusTime.value = config.focusTime
        breakTime.value = config.breakTime
        totalCycles.value = config.totalCycles
        theme.value = config.theme
        compact.value = config.compact
        autoStart.value = config.autoStart
    }

    const saveConfig = async (config: Partial<TimerConfig>) => {
        if (config.focusTime !== undefined) {
            focusTime.value = config.focusTime
        }
        if (config.breakTime !== undefined) {
            breakTime.value = config.breakTime
        }
        if (config.totalCycles !== undefined) {
            totalCycles.value = config.totalCycles
        }
        if (config.theme) {
            theme.value = config.theme
        }
        if (config.compact !== undefined) {
            compact.value = config.compact
        }

        if (status.value === TimerStatus.FOCUSING) {
            const newFocusSeconds = focusTime.value * 60
            if (remainingSeconds.value > newFocusSeconds) {
                remainingSeconds.value = newFocusSeconds
            }
        }

        if (status.value === TimerStatus.BREAKING) {
            const newBreakSeconds = breakTime.value * 60
            if (remainingSeconds.value > newBreakSeconds) {
                remainingSeconds.value = newBreakSeconds
            }
        }

        if (currentCycle.value >= totalCycles.value) {
            currentCycle.value = totalCycles.value
            if (isAllCycleFinished.value) {
                status.value = TimerStatus.FINISHED
                remainingSeconds.value = 0
                if (timerId.value) {
                    clearInterval(timerId.value)
                    timerId.value = null
                }
            }
        }

        if (config.autoStart !== undefined) {
            await setAutoStart(config.autoStart)
            autoStart.value = config.autoStart
        }

        try {
            await saveConfigService({
                focusTime: focusTime.value,
                breakTime: breakTime.value,
                totalCycles: totalCycles.value,
                theme: theme.value,
                compact: compact.value,
            })
        } catch (e) {
            console.error('🍅 保存番茄时钟配置失败: ', e)
        }
    }

    const resetConfig = async () => {
        await saveConfig(DEFAULT_CONFIG)
    }

    const startTimer = () => {
        if (status.value === TimerStatus.FINISHED) {
            resetRuntime()
        }
        if (isTimerRunning.value) {
            return
        }

        if (timerId.value) {
            clearInterval(timerId.value)
            timerId.value = null
        }

        if (status.value === TimerStatus.READY) {
            remainingSeconds.value = focusTime.value * 60
            status.value = TimerStatus.FOCUSING
        } else if (status.value === TimerStatus.PAUSED && previousStatus.value) {
            status.value = previousStatus.value
            previousStatus.value = null
        }

        timerId.value = window.setInterval(countdownHandler, 1000)
    }

    const pauseTimer = () => {
        if (timerId.value) {
            clearInterval(timerId.value)
            timerId.value = null
        }
        if (isTimerRunning.value) {
            previousStatus.value = status.value
            status.value = TimerStatus.PAUSED
        }
    }

    const resetRuntime = () => {
        pauseTimer()
        status.value = TimerStatus.READY
        previousStatus.value = null
        currentCycle.value = 0
        remainingSeconds.value = 0
    }

    const setTheme = async (newTheme: string) => {
        theme.value = newTheme
        await saveConfig({theme: newTheme})
    }

    const fastForward = () => {
        if (isTimerRunning.value) {
            remainingSeconds.value = 1
        }
    }

    const toggleCompact = async () => {
        compact.value = !compact.value
        await saveConfig({compact: compact.value})
    }

    return {
        focusTime,
        breakTime,
        totalCycles,
        theme,
        autoStart,
        status,
        previousStatus,
        currentCycle,
        remainingSeconds,
        compact,
        formattedTime,
        cycleText,
        isAllCycleFinished,
        isTimerRunning,
        initConfig,
        saveConfig,
        resetConfig,
        startTimer,
        pauseTimer,
        resetRuntime,
        onAllCycleFinished,
        setTheme,
        fastForward,
        toggleCompact,
    }
})
