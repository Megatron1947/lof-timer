import {TimerConfig} from '@/types/timer'
import {Store} from '@tauri-apps/plugin-store'
import {enable, isEnabled, disable} from '@tauri-apps/plugin-autostart'

let store: Store | null = null

export const DEFAULT_CONFIG: Readonly<TimerConfig> = {
    focusTime: 25,
    breakTime: 5,
    totalCycles: 4,
    theme: 'light',
    compact: false,
    autoStart: false,
}

export const getStore = async (): Promise<Store> => {
    if (!store) {
        store = await Store.load('settings.json')
    }
    return store
}

export const validatePositiveNum = (num: unknown, defaultValue: number): number => {
    const n = Number(num)
    return Number.isInteger(n) && n > 0 ? n : defaultValue
}

export const loadConfig = async (): Promise<TimerConfig> => {
    try {
        const [store, autoStartEnabled] = await Promise.all([getStore(), isEnabled()])
        const storedConfig = await store.get('config')
        if (storedConfig) {
            const parsed = storedConfig as TimerConfig
            return {
                focusTime: validatePositiveNum(parsed.focusTime, DEFAULT_CONFIG.focusTime),
                breakTime: validatePositiveNum(parsed.breakTime, DEFAULT_CONFIG.breakTime),
                totalCycles: validatePositiveNum(
                    parsed.totalCycles,
                    DEFAULT_CONFIG.totalCycles,
                ),
                theme: parsed.theme || DEFAULT_CONFIG.theme,
                compact: parsed.compact || false,
                autoStart: autoStartEnabled || false,
            }
        }
        return {...DEFAULT_CONFIG, autoStart: autoStartEnabled || false}
    } catch (e) {
        const autoStartEnabled = await isEnabled()
        return {...DEFAULT_CONFIG, autoStart: autoStartEnabled || false}
    }
}

export const saveConfig = async (config: Partial<TimerConfig>): Promise<void> => {
    const store = await getStore()
    await store.set('config', config)
    await store.save()
}

export const setAutoStart = async (enabled: boolean): Promise<void> => {
    if (enabled) {
        await enable()
    } else {
        await disable()
    }
}
