<template>
    <div class="bg-base-200 w-80 p-6 min-h-screen">
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
                max="20"
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
import {onMounted, ref} from 'vue'

const timerStore = useTimerStore()
const {focusTime, breakTime, totalCycles, theme} = storeToRefs(timerStore)
const resetConfig = timerStore.resetConfig
const saveConfig = timerStore.saveConfig
// 更新专注时间
const updateFocusTime = (event: Event) => {
    const target = event.target as HTMLInputElement
    saveConfig({focusTime: parseInt(target.value)})
}

// 更新休息时间
const updateBreakTime = (event: Event) => {
    const target = event.target as HTMLInputElement
    saveConfig({breakTime: parseInt(target.value)})
}

// 更新循环次数
const updateTotalCycles = (event: Event) => {
    const target = event.target as HTMLInputElement
    saveConfig({totalCycles: parseInt(target.value)})
}

// 更新主题
const updateTheme = (event: Event) => {
    const target = event.target as HTMLInputElement
    saveConfig({theme: target.value})
}

const daisyThemes = ref<{name: string; label: string}[]>([])
const getDaisyThemes = async () => {
    // 从 DaisyUI 包中导入主题对象
    const {default: allThemes} = await import('daisyui/theme/object')
    // 提取主题名称列表
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
