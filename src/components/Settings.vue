<template>
    <div class="bg-base-200 w-80 p-6 h-full">
        <div>
            <h2 class="text-xl font-bold mb-6 text-primary transition-all duration-300">
                设置
            </h2>
        </div>
        <!-- 专注时间设置 -->
        <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">专注时间</label>
                <span class="text-sm font-semibold">{{ focusTime }} 分钟</span>
            </div>
            <input
                type="range"
                min="5"
                max="60"
                step="5"
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
                min="5"
                max="25"
                step="5"
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
        <!-- 主题设置 -->
        <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">主题</label>
            </div>
            <select
                class="select select-primary transition-all duration-300"
                @change="updateTheme"
                :value="theme">
                <option v-for="t in daisyThemes" :key="t.name" :value="t.name">
                    {{ t.label }}
                </option>
            </select>
        </div>
        <!-- 自动启动 -->
        <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">自动启动</label>
            </div>
            <input
                type="checkbox"
                :checked="autoStart"
                class="toggle toggle-primary toggle-xl transition-all duration-300"
                @change="handleAutoStartChange" />
        </div>
        <!-- 重置按钮 -->
        <div class="mt-8">
            <button
                class="btn btn-ghost w-full hover:btn-primary/10 transition-all duration-300"
                @click="resetConfig">
                恢复默认设置
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import {useTimerStore} from '@/stores/timerStore.ts'
import {storeToRefs} from 'pinia'
import {onMounted, ref, watch} from 'vue'
import {useDebounceFn} from '@vueuse/core'

const timerStore = useTimerStore()
const {focusTime, breakTime, totalCycles, theme, autoStart, compact} = storeToRefs(timerStore)
const resetConfig = timerStore.resetConfig
const updateConfig = timerStore.updateConfig
const persistConfig = timerStore.persistConfig
const updateAutoStart = timerStore.updateAutoStart

const updateFocusTime = (event: Event) => {
    const target = event.target as HTMLInputElement
    updateConfig({focusTime: parseInt(target.value)})
}

const updateBreakTime = (event: Event) => {
    const target = event.target as HTMLInputElement
    updateConfig({breakTime: parseInt(target.value)})
}

const updateTotalCycles = (event: Event) => {
    const target = event.target as HTMLInputElement
    updateConfig({totalCycles: parseInt(target.value)})
}

const updateTheme = (event: Event) => {
    const target = event.target as HTMLInputElement
    updateConfig({theme: target.value})
}

const debouncedPersist = useDebounceFn(() => {
    persistConfig()
}, 500)

watch([focusTime, breakTime, totalCycles, theme, compact], () => {
    debouncedPersist()
})

const handleAutoStartChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    await updateAutoStart(target.checked)
    await persistConfig()
}

const daisyThemes = ref<{name: string; label: string}[]>([])
const getDaisyThemes = async () => {
    const {default: allThemes} = await import('daisyui/theme/object')
    daisyThemes.value = Object.keys(allThemes).map((name) => ({
        name,
        label: name.charAt(0).toUpperCase() + name.slice(1),
    }))
}

onMounted(async () => {
    await timerStore.initConfig()
    await getDaisyThemes()
})
</script>
