import App from "./App.vue"
import { createApp } from "vue";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import library from '@/plugins/fontAwesomeIcons'
import { VueQueryPlugin,QueryClient } from "@tanstack/vue-query";
import { createPinia } from     "pinia";
import mitt from    "mitt";
import axios from "axios";
import interceptors from "./plugins/axios/interceptors";
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'

// Taiwind Css
import "@/assets/css/index.css"

// Global CSS
import "@/assets/scss/global.scss";

// Icons
library

// api interceptors
interceptors(axios);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: 1,
    },
  },
});
//define libs
const pinia = createPinia();
const emitter = mitt();

const app = createApp(App)

//provice mitt
app.provide("emitter", emitter);

//use libs
app.use(pinia)
app.use(VueQueryPlugin, { queryClient })
app.use(router)
app.use(vuetify)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

