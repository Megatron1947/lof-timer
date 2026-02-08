import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import {useTimerStore} from './stores/timerStore'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

app.mount('#app')

const timerStore = useTimerStore()
setTimeout(() => {
    timerStore.initConfig()
}, 100)
