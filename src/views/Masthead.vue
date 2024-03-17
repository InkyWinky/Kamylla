<template id="masthead">
  <div
    style="height: 50px; border-bottom: solid 1px #cccccc; margin-top: 3px"
    class="uk-text-center uk-flex uk-flex-row uk-flex-between uk-flex-middle"
  >
    <img
      class="uk-iconnav uk-padding-medium"
      style="width: 180px; margin-left: 0px"
      src="/assets/kamylla_logo.png"
    />

    <div
      @click="changePath('profile')"
      id="profile-nav"
      class="
        uk-flex
        uk-flex-column
        uk-flex-center
        uk-padding-small
        uk-margin-top-large
        uk-height-1-1
        icon
      "
      ref="profile-nav"
    >
      <!-- <div uk-icon="icon:user;ratio:1.3" /> -->
      <!-- {{ this.currentUser.avatar }} -->
      <img id="avatar" :src="setAvatar()" />

      <small class="authcate uk-text-uppercase">{{ this.currentUser.authcate }}</small>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

import * as constants from "../scripts/dictionary";

export default {
  name: "Masthead",
  data: function () {
    return {
      searchInFocus: false,
      title: "",
    };
  },
  mounted() {
    this.title = this.$router.currentRoute.path.split("/")[1];
  },
  computed: {
    ...mapState("accounts", {
      currentUser: "currentUser",
    }),
  },
  watch: {
    $route(to, from) {
      this.title = to.path.split("/")[1];
      if (this.title === "profile") {
        this.highlightProfileIcon(true);
      } else {
        this.highlightProfileIcon(false);
      }
    },
  },
  methods: {
    changePath(path) {
      this.$router.push(`/${path}`);
      this.$store.state.currentPath = path;
    },
    highlightProfileIcon(highlight) {
      if (highlight) {
        this.$refs["profile-nav"].style.color = "#1e87f0";
      } else {
        this.$refs["profile-nav"].style.color = "black";
      }
    },

    setAvatar() {
      return this.currentUser.avatar;
    },
  },
};
</script>

<style scoped>
#avatar {
  /* width: 20%; */
  /* flex-basis: 30%; */
  /* flex: 10%; */
  height: 170%;
  margin-bottom: 0;
}
.authcate {
  font-size: 0.6em;
}
#profile-nav {
  cursor: pointer;
}
</style>
