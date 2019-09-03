import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Qs from "qs";
import axios from "axios";
const $ = require('jquery');
import api from "./utils/api";
Vue.config.productionTip = false;
Vue.prototype.axios = axios;
Vue.prototype.Qs = Qs;
Vue.prototype.$https = "/api";
Vue.prototype.api = api;
Vue.prototype.$ = $;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
