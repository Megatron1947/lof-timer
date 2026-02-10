<template>
    <div class="flex flex-col items-center font-mono z-10">
        <div class="text-8xl font-bold text-primary transition-all duration-300">
            <span class="countdown">
                <span
                    :style="{
                        '--value': Math.floor(remainingSeconds / 60),
                        '--digits': 2,
                    }"
                    aria-live="polite"
                    >{{
                        Math.floor(remainingSeconds / 60)
                            .toString()
                            .padStart(2, '0')
                    }}</span
                >
            </span>
            <span>:</span>
            <span class="countdown">
                <span
                    :style="{
                        '--value': remainingSeconds % 60,
                        '--digits': 2,
                    }"
                    aria-live="polite"
                    >{{ (remainingSeconds % 60).toString().padStart(2, '0') }}</span
                >
            </span>
        </div>
        <div class="text-4xl text-accent transition-all duration-300">
            <span>
                {{ cycleText }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useTimerStore} from '@/stores/timerStore'
import {storeToRefs} from 'pinia'

const timerStore = useTimerStore()
const {remainingSeconds, cycleText} = storeToRefs(timerStore)
</script>

<style scoped></style>
