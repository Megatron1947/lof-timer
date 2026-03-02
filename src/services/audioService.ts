export enum SoundType {
    FOCUS_END = 'focusEnd',
    BREAK_END = 'breakEnd',
    TOTAL_CYCLES_END = 'totalCyclesEnd',
}

const getSoundPath = (soundType: SoundType): string => {
    switch (soundType) {
        case SoundType.FOCUS_END:
            return '/audio/focusEnd.mp3'
        case SoundType.BREAK_END:
            return '/audio/breakEnd.mp3'
        case SoundType.TOTAL_CYCLES_END:
            return '/audio/totalCyclesEnd.mp3'
        default:
            return ''
    }
}

export const play = (soundType: SoundType): void => {
    try {
        const soundPath = getSoundPath(soundType)
        if (!soundPath) {
            console.warn('🍅 未找到对应的音效文件')
            return
        }
        const audio = new Audio(soundPath)
        audio.play().catch((error) => {
            console.error('🍅 播放音效失败: ', error)
        })
    } catch (error) {
        console.error('🍅 播放音效失败: ', error)
    }
}
