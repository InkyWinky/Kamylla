<template>
  <div id="app">
    <div
      v-if="this.$router.currentRoute.path !== '/'"
      class="uk-flex uk-flex-row"
    >
      <Navbar />
      <div id="app-main" class="uk-flex uk-flex-column uk-width-expand">
        <Masthead />

        <router-view></router-view>
      </div>
    </div>
    <div v-if="this.$router.currentRoute.path === '/'">
      <router-view></router-view>
    </div>
    <Icon />
  </div>
</template>

<script>
import Navbar from "./views/Navbar.vue";
import Masthead from "./views/Masthead.vue";
import Icon from "./views/Icon.vue";

export default {
  name: "App",
  data() {
    return {
      test: "test",
    };
  },
  components: {
    Navbar,
    Masthead,
    Icon,
  },
  computed: {
    isIdle() {
      console.log("Idle vue: ", this.$store.state.idleVue.isIdle);
      return this.$store.state.idleVue.isIdle;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  max-height: 100vh;
  overflow-y: hidden;
}
</style>
