import App from "./App.vue"
import { createApp } from "vue";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import library from '@/plugins/fontAwesomeIcons'
import { VueQueryPlugin } from "vue-query";
import { createPinia } from     "pinia";
import mitt from    "mitt";
import axios from "axios";
import interceptors from "./plugins/axios/interceptors";

// Taiwind Css
import "@/assets/css/index.css"

// Global CSS
import "@/assets/scss/global.scss";

// Icons
library

// api interceptors
interceptors(axios);

//define libs
const pinia = createPinia();
const emitter = mitt();

const app = createApp(App)

//provice mitt
app.provide("emitter", emitter);

//use libs
app.use(pinia)
app.use(VueQueryPlugin)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

