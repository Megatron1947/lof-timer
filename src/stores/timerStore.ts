import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {TimerConfig, TimerStatus} from '@/types/timer'
import {Store} from '@tauri-apps/plugin-store'
import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from '@tauri-apps/plugin-notification'

// Store 实例
let store: Store | null = null

// 初始化 Store 实例
const getStore = async (): Promise<Store> => {
    if (!store) {
        store = await Store.load('settings.json')
    }
    return store
}

/**
 * 发送通知的工具方法，包含权限检查和请求
 * @param title 通知标题
 * @param body 通知内容
 */
const sendSystemNotification = async (title: string, body: string) => {
    // 检查是否有发送通知的权限
    let permissionGranted = await isPermissionGranted()

    // 如果没有，请求权限
    if (!permissionGranted) {
        const permission = await requestPermission()
        permissionGranted = permission === 'granted'
    }

    // 获得权限后发送通知
    if (permissionGranted) {
        sendNotification({title, body})
    }
}

// 默认配置
const DEFAULT_CONFIG: Readonly<TimerConfig> = {
    // 专注时间(分钟)
    focusTime: 25,
    // 休息时间(分钟)
    breakTime: 5,
    // 总循环次数
    totalCycles: 4,
    // 主题
    theme: 'light',
    // 模式
    compact: false,
}

export const useTimerStore = defineStore('timer', () => {
    const focusTime = ref(DEFAULT_CONFIG.focusTime)
    const breakTime = ref(DEFAULT_CONFIG.breakTime)
    const totalCycles = ref(DEFAULT_CONFIG.totalCycles)
    const theme = ref(DEFAULT_CONFIG.theme)

    // 当前状态
    const status = ref<TimerStatus>(TimerStatus.READY)
    // 之前的运行状态(用于暂停后恢复)
    const previousStatus = ref<TimerStatus | null>(null)
    // 当前循环数(从0开始)
    const currentCycle = ref(0)
    // 剩余秒数(倒计时核心)
    const remainingSeconds = ref(0)
    // 定时器ID, 用于清除/暂停
    const timerId = ref<number | null>(null)
    // 精简模式状态
    const compact = ref(false)

    // 格式化剩余时间为 mm:ss 格式
    const formattedTime = computed(() => {
        const minutes = Math.floor(remainingSeconds.value / 60)
        const seconds = remainingSeconds.value % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    // 循环文本(如 0/4, 3/4)
    const cycleText = computed(() => {
        return `${currentCycle.value}/${totalCycles.value}`
    })

    // 判断是否完成所有循环
    const isAllCycleFinished = computed(() => {
        return currentCycle.value >= totalCycles.value
    })

    // 判断是否处于运行状态(专注中/休息中, 非未开始/暂停中)
    const isTimerRunning = computed(() => {
        return status.value === TimerStatus.FOCUSING || status.value === TimerStatus.BREAKING
    })

    /**
     * 正整数合法性校验: 非正整数返回默认值, 保证配置合法
     * @param num 待校验值
     * @param defaultValue 兜底默认值
     */
    const _validatePositiveNum = (num: unknown, defaultValue: number): number => {
        const n = Number(num)
        return Number.isInteger(n) && n > 0 ? n : defaultValue
    }

    /**
     * 倒计时核心处理: 每秒减1, 归零时触发状态切换
     */
    const _countdownHandler = () => {
        // 非运行状态, 直接返回(防止定时器残留执行)
        if (!isTimerRunning.value) {
            return
        }
        // 剩余秒数归0, 触发状态切换
        if (remainingSeconds.value <= 0) {
            _switchStatus()
            return
        }
        // 正常倒计时, 秒数减1
        remainingSeconds.value--
    }

    /**
     * 状态自动切换: 专注→休息 / 休息→专注/结束
     */
    const _switchStatus = () => {
        switch (status.value) {
            case TimerStatus.FOCUSING:
                status.value = TimerStatus.BREAKING
                remainingSeconds.value = breakTime.value * 60
                // 发送专注时间结束通知
                ;(async () => {
                    await sendSystemNotification('专注时间结束', '开始休息吧~')
                })()
                break
            case TimerStatus.BREAKING:
                currentCycle.value++
                if (isAllCycleFinished.value) {
                    status.value = TimerStatus.FINISHED
                    remainingSeconds.value = 0
                    // 调用所有循环完成的钩子函数
                    onAllCycleFinished()
                } else {
                    status.value = TimerStatus.FOCUSING
                    remainingSeconds.value = focusTime.value * 60
                    // 发送休息时间结束通知
                    ;(async () => {
                        await sendSystemNotification('休息时间结束', '开始下一轮专注~')
                    })()
                }
                break
            default:
                break
        }
    }

    /**
     * 初始化配置: 从 Store 加载持久化配置, 无配置则用默认值
     * 应用启动时自动执行, 无需组件手动调用
     */
    const initConfig = async () => {
        try {
            const store = await getStore()
            const storedConfig = await store.get('config')
            if (storedConfig) {
                // 解析本地配置并校验合法性
                const parsed = storedConfig as TimerConfig
                focusTime.value = _validatePositiveNum(
                    parsed.focusTime,
                    DEFAULT_CONFIG.focusTime,
                )
                breakTime.value = _validatePositiveNum(
                    parsed.breakTime,
                    DEFAULT_CONFIG.breakTime,
                )
                totalCycles.value = _validatePositiveNum(
                    parsed.totalCycles,
                    DEFAULT_CONFIG.totalCycles,
                )
                theme.value = parsed.theme || DEFAULT_CONFIG.theme
                compact.value = parsed.compact || false
            }
        } catch (e) {
            // 解析失败, 重置为默认配置
            await resetConfig()
        }
    }

    /**
     * 保存配置: 更新配置并同步到 Store
     * @param config 新的配置项(支持部分更新, 如仅修改focusTime)
     */
    const saveConfig = async (config: Partial<TimerConfig>) => {
        // 先校验并更新配置
        focusTime.value = _validatePositiveNum(config.focusTime, focusTime.value)
        breakTime.value = _validatePositiveNum(config.breakTime, breakTime.value)
        totalCycles.value = _validatePositiveNum(config.totalCycles, totalCycles.value)
        if (config.theme) {
            theme.value = config.theme
        }
        // 处理异常情况
        // 1. 专注状态下调整focusTime小于当前剩余时间
        if (status.value === TimerStatus.FOCUSING) {
            const newFocusSeconds = focusTime.value * 60
            if (remainingSeconds.value > newFocusSeconds) {
                remainingSeconds.value = newFocusSeconds
            }
        }
        // 2. 休息状态下调整breakTime小于当前剩余时间
        if (status.value === TimerStatus.BREAKING) {
            const newBreakSeconds = breakTime.value * 60
            if (remainingSeconds.value > newBreakSeconds) {
                remainingSeconds.value = newBreakSeconds
            }
        }
        // 3. 调整totalCycles小于当前循环数
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

        // 同步到 Store
        try {
            const store = await getStore()
            await store.set('config', {
                focusTime: focusTime.value,
                breakTime: breakTime.value,
                totalCycles: totalCycles.value,
                theme: theme.value,
            })
            await store.save()
        } catch (e) {
            console.error('🍅 保存番茄时钟配置失败: ', e)
        }
    }

    /**
     * 重置配置: 恢复为默认配置并同步到 Store
     */
    const resetConfig = async () => {
        await saveConfig(DEFAULT_CONFIG)
    }

    /**
     * 开始/恢复倒计时:
     * - 未开始 → 切入专注中, 初始化专注秒数
     * - 暂停中 → 恢复到原运行状态(专注/休息), 继续倒计时
     * - 运行中 → 无操作(防重复点击)
     * - 已结束 → 先重置运行状态, 再启动新循环
     */
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

        timerId.value = window.setInterval(_countdownHandler, 1000)
    }

    /**
     * 暂停倒计时:
     * - 清除定时器, 停止秒数递减
     * - 仅运行状态(专注/休息)可切换为暂停中
     */
    const pauseTimer = () => {
        // 清除定时器
        if (timerId.value) {
            clearInterval(timerId.value)
            timerId.value = null
        }
        // 仅运行状态下, 切换为暂停中并保存之前的运行状态
        if (isTimerRunning.value) {
            previousStatus.value = status.value
            status.value = TimerStatus.PAUSED
        }
    }

    /**
     * 重置运行时状态: 恢复到[未开始], 清空定时器/剩余秒数/当前循环
     * 任意状态下点击[重置]均触发此方法
     */
    const resetRuntime = () => {
        // 先暂停定时器, 防止残留
        pauseTimer()
        // 重置所有运行时状态
        status.value = TimerStatus.READY
        previousStatus.value = null
        currentCycle.value = 0
        remainingSeconds.value = 0
    }

    /**
     * 所有循环完成的钩子函数: 可扩展 Tauri 通知, 提示音等功能
     * 组合式 API 中直接在此扩展, 无需修改核心逻辑
     */
    const onAllCycleFinished = () => {
        // 发送所有循环完成通知
        ;(async () => {
            await sendSystemNotification('所有循环完成', '恭喜完成专注~')
        })()
    }

    /**
     * 设置主题
     * @param newTheme 主题名称
     */
    const setTheme = async (newTheme: string) => {
        theme.value = newTheme
        await saveConfig({theme: newTheme})
    }

    /**
     * 快速结束当前阶段: 将剩余时间设置为1秒, 快速触发状态转换
     * 仅运行状态(专注/休息)可调用
     */
    const fastForward = () => {
        if (isTimerRunning.value) {
            remainingSeconds.value = 1
        }
    }

    /**
     * 切换精简模式状态
     */
    const toggleCompact = () => {
        compact.value = !compact.value
    }

    return {
        // 配置状态
        focusTime,
        breakTime,
        totalCycles,
        theme,
        // 运行时状态
        status,
        previousStatus,
        currentCycle,
        remainingSeconds,
        compact,
        // 计算属性
        formattedTime,
        cycleText,
        isAllCycleFinished,
        isTimerRunning,
        // 公共方法
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
