import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import router from "./router";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue"; // import lottie-vuejs

Vue.config.productionTip = false;

Vue.use(LottieAnimation); // add lottie-animation to your global scope
new Vue({
  vuetify,
  store,
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
