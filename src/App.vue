<template>
    <div class="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
        <!-- 状态文字 -->
        <div class="text-base-content/80 text-lg font-medium mb-8">
            状态...
        </div>

        <!-- 环形进度条 -->
        <div class="flex items-center justify-center w-full max-w-sm">
            <!-- 外层环形 -->
            <div
                class="radial-progress text-base-300"
                style="--value: 100; --size: 20rem; --thickness: 0.5rem"
                role="progressbar"
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100">
                <!-- 内层环形 -->
                <div
                    class="radial-progress text-primary"
                    style="--value: 70; --size: 16rem; --thickness: 0.5rem"
                    role="progressbar"
                    aria-valuenow="70"
                    aria-valuemin="0"
                    aria-valuemax="100">
                    <!-- 中心双行文本 -->
                    <div class="flex flex-col items-center">
                        <span class="text-7xl font-bold">59:59</span>
                        <span class="text-4xl opacity-60">1/4</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部按钮 -->
        <div class="mt-8 flex gap-4">
            <button class="btn btn-primary min-w-24">启动</button>
            <button class="btn btn-ghost min-w-24">重置</button>
            <button class="btn btn-ghost min-w-24">设置</button>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
