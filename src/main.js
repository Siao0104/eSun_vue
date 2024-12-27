import { createApp } from 'vue'
import App from './App.vue'
//bootstrap
import "bootstrap/scss/bootstrap.scss";
//elementPlus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//router
import router from './router/route.js'
//store
import store from './store/index.js'

createApp(App)
    .use(ElementPlus)
    .use(router)
    .use(store).mount('#app')
