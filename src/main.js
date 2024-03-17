import Vue from "vue";
import VueRouter from "vue-router";
import IdleVue from "idle-vue";

import App from "./App.vue";
import Login from "./views/Login";
import Take from "./views/Take";
import Return from "./views/Return";
import Profile from "./views/Profile";
import Search from "./views/Search";

import store from "./store";

Vue.config.productionTip = false;

const eventsHub = new Vue();

Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 300000, //5 minutes
});

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: "history",
  base: __dirname,
  routes: [
    { path: "/", component: Login },
    { path: "/take", component: Take },
    { path: "/return", component: Return },
    { path: "/profile", component: Profile },
    { path: "/search", component: Search },
  ],
});

new Vue({
  render: (h) => h(App),
  router,
  store,
  onIdle() {
    //logout if idle
    console.log("idle");
    this.$store.state.idle = true;
    this.$store.dispatch("accounts/logout");
  },
  onActive() {
    console.log("active");
    this.$store.state.idle = false;
  },
}).$mount("#app");
