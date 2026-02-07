// 运行状态枚举
export enum TimerStatus {
    READY = '就绪',
    FOCUSING = '专注中',
    BREAKING = '休息中',
    PAUSED = '暂停',
    FINISHED = '结束',
}

export interface TimerConfig {
    // 专注时间, 单位: 分钟
    focusTime: number
    // 休息时间, 单位: 分钟
    breakTime: number
    // 总循环次数
    totalCycles: number
    // 主题
    theme: string
    // 精简模式
    compact: boolean
    // 自动启动
    autoStart: boolean
}
