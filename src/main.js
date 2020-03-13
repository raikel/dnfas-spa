import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueLogger from 'vuejs-logger';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/es'; // lang i18n

import 'plyr/dist/plyr.css';

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';
import filters from './filters';

import '@/icons'; // icon
import '@/permission'; // permission control

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

for (const filterName of Object.keys(filters)) {
    Vue.filter(filterName, filters[filterName]);
}

const logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'error';

Vue.use(VueLogger, {
    isEnabled: true,
    logLevel: logLevel,
    stringifyArguments: false,
    showLogLevel: true,
    showMethodName: true,
    separator: '|',
    showConsoleColors: true
});

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
