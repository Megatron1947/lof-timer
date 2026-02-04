import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import {useTimerStore} from './stores/timerStore'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// 初始化定时器配置
const timerStore = useTimerStore()
timerStore.initConfig()

app.mount('#app')
