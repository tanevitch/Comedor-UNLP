import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axios from 'axios';
import VueSweetalert2 from 'vue-sweetalert2';
import VCalendar from 'v-calendar';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'materialize-css/dist/css/materialize.css'
import 'materialize-css/dist/js/materialize.js'
import 'v-credit-card/dist/VCreditCard.css';

import {store} from "./store"

axios.interceptors.request.use(function (config) {
  if (store.getters.estaAutenticado){
    config.headers['token'] = localStorage.getItem('token').replaceAll('"', "")
    return config

  }
  return config
})

axios.interceptors.response.use(function (response) {
  return response;
  }, function (error) {
    if (error.response.status == 401 || error.response.status == 403){
      store.commit("logout");
      window.location.href= "/ingresar"
      return Promise.reject(error);
    }
    return Promise.reject(error);
  });
Vue.config.productionTip = false
Vue.prototype.$axios=axios
Vue.prototype.$store=store

const options = {
  confirmButtonColor: '#26a69a',
  cancelButtonColor: '#B71C1C',
  reverseButtons: true,
  confirmButtonText: 'ACEPTAR',
  cancelButtonText: 'CANCELAR',
  allowOutsideClick: false,
};
Vue.use(VueSweetalert2,options);
Vue.use(VCalendar)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
