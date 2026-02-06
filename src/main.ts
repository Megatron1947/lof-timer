import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import {useTimerStore} from './stores/timerStore'

async function initApp() {
    const app = createApp(App)
    const pinia = createPinia()
    app.use(pinia)

    // 初始化定时器配置
    const timerStore = useTimerStore()
    await timerStore.initConfig()

    app.mount('#app')
}

initApp()
