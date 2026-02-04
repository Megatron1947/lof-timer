import {defineConfig, presetAttributify} from 'unocss'
import presetWind4 from '@unocss/preset-wind4'

export default defineConfig({
    content: {
        pipeline: {
            include: ['src/**/*.{js,ts,vue}'],
        },
    },
    presets: [presetWind4(), presetAttributify()],
    rules: [],
})
