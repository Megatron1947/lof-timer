<template>
    <div
        class="radial-progress"
        :class="color"
        :style="`--value: ${value}; --size: ${size}; --thickness: ${thickness}`"
        role="progressbar"
        :aria-valuenow="value"
        aria-valuemin="0"
        aria-valuemax="100">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    value: number
    size?: string
    thickness?: string
    color?: string
}>()
</script>

<style scoped></style>
