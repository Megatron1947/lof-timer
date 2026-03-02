import {Ref, ComputedRef} from 'vue'
import {TimerStatus} from '@/types/timer'
import {sendSystemNotification} from '@/services/notificationService'
import {play, SoundType} from '@/services/audioService'

export const useTimerLogic = (options: {
    status: Ref<TimerStatus>
    remainingSeconds: Ref<number>
    focusTime: Ref<number>
    breakTime: Ref<number>
    currentCycle: Ref<number>
    isTimerRunning: ComputedRef<boolean>
    isAllCycleFinished: ComputedRef<boolean>
    sound: Ref<boolean>
    onAllCycleFinishedCallback?: () => void
}) => {
    const {
        status,
        remainingSeconds,
        focusTime,
        breakTime,
        currentCycle,
        isTimerRunning,
        isAllCycleFinished,
        sound,
        onAllCycleFinishedCallback,
    } = options

    const switchStatus = () => {
        switch (status.value) {
            case TimerStatus.FOCUSING:
                status.value = TimerStatus.BREAKING
                remainingSeconds.value = breakTime.value * 60
                ;(async () => {
                    await sendSystemNotification('专注时间结束', '开始休息 ~')
                })()
                if (sound.value) {
                    play(SoundType.FOCUS_END)
                }
                break
            case TimerStatus.BREAKING:
                currentCycle.value++
                if (isAllCycleFinished.value) {
                    status.value = TimerStatus.FINISHED
                    remainingSeconds.value = 0
                    if (onAllCycleFinishedCallback) {
                        onAllCycleFinishedCallback()
                    }
                } else {
                    status.value = TimerStatus.FOCUSING
                    remainingSeconds.value = focusTime.value * 60
                    ;(async () => {
                        await sendSystemNotification('休息时间结束', '开始专注 ~')
                    })()
                    if (sound.value) {
                        play(SoundType.BREAK_END)
                    }
                }
                break
            default:
                break
        }
    }

    const countdownHandler = () => {
        if (!isTimerRunning.value) {
            return
        }
        if (remainingSeconds.value <= 0) {
            switchStatus()
            return
        }
        remainingSeconds.value--
    }

    return {
        countdownHandler,
        switchStatus,
    }
}

export const onAllCycleFinished = (sound: Ref<boolean>) => {
    ;(async () => {
        await sendSystemNotification('所有循环完成', '恭喜完成专注~')
    })()
    if (sound.value) {
        play(SoundType.TOTAL_CYCLES_END)
    }
}
