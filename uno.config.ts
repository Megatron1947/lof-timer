import {defineConfig, presetMini} from 'unocss'
import {presetWind4} from '@unocss/preset-wind4'
import {presetDaisyui} from '@0x-jerry/unocss-preset-daisyui'

export default defineConfig({
    presets: [
        presetMini(),
        // When use with wind4 preset, you need to disable reset preflight,
        // because preset daisyui already included it.
        presetWind4({
            preflights: {
                reset: false,
            },
        }),
        presetDaisyui(),
    ],
    rules: [],
})
