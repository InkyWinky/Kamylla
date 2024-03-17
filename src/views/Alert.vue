<template>
  <div>
    <div class="uk-alert-danger" uk-alert>{{ $store.state.alertMsg }}</div>
  </div>
</template>

<script>
import { ALERT_SHOW_MUTATION } from "../scripts/dictionary";
import store from "../store";
export default {
  mounted() {
    this.clearAlert();
  },
  watch: {
    $route(to, from) {
      this.clearAlert();
    },
  },
  methods: {
    clearAlert() {
      store.commit(ALERT_SHOW_MUTATION, false);
    },
  },
};
</script>

<style lang="scss" scoped></style>
