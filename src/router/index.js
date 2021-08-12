import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/paymentStatus",
    name: "PaymentStatus",
    component: function() {
      return import(
        /* webpackChunkName: "about" */ "../views/PaymentStatus.vue"
      );
    }
  },
  {
    path: "/payment",
    name: "Payment",
    component: function() {
      return import(
        /* webpackChunkName: "about" */ "../views/PaymentIFrame.vue"
      );
    }
  },
  {
    path: "/success",
    name: "SuccessPayment",
    component: function() {
      return import(
        /* webpackChunkName: "about" */ "../views/PaymentSuccessful.vue"
      );
    }
  },
  {
    path: "/failed",
    name: "FailedPayment",
    component: function() {
      return import(
        /* webpackChunkName: "about" */ "../views/PaymentFailed.vue"
      );
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
