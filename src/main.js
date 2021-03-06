import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import http from './utils/http'
import Aplayer from "vue-aplayer";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Aplayer);

// axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.prototype.$axios = http;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')