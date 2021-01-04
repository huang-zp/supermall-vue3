import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mitt from "mitt";
import Toaster from "@meforma/vue-toaster";

const emitter = mitt();
let app = createApp(App)

app.config.globalProperties.emitter = emitter

app.use(store).use(router).use(Toaster).mount('#app')
