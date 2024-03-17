<template id="navbar">
  <div
    v-if="this.$router.currentRoute.path !== '/'"
    class="uk-flex uk-flex-row uk-grid uk-grid-column-collapse"
    uk-grid
    style="z-index: 10; background: white"
  >
    <div class="uk-width-xsmall uk-height-viewport uk-background">
      <div class="uk-flex uk-flex-column uk-flex-stretch" id="sidebar">
        <div class="uk-background uk-padding-small uk-padding-medium-top">
          <a
            style="text-decoration: none; color: black"
            href="#offcanvas-slide"
            class="uk-text-decoration-none"
            uk-toggle
            ><span class="" uk-icon="icon:menu;ratio:1.5"></span
          ></a>
        </div>
        <div
          @click="changePath('take')"
          id="take-nav"
          ref="take-nav"
          class="icon uk-padding-small"
        >
          <span class="" uk-icon="icon:sign-in;ratio:1.5"></span>
          <small>Take</small>
        </div>
        <div
          @click="changePath('return')"
          id="return-nav"
          ref="return-nav"
          class="icon uk-padding-small"
        >
          <span uk-icon="icon:refresh;ratio:1.5"></span>
          <small>Return</small>
        </div>
        <!-- COMMENTING OUT SEARCH FOR NOW -->
        <!-- <div
          @click="changePath('search')"
          id="search-nav"
          ref="search-nav"
          class="icon uk-padding-small"
        >
          <span uk-icon="icon:search;ratio:1.5"></span>
          <small>Search</small>
        </div> -->
        <!-- COMMENTING OUT HISTORY PART FOR NOW: -->
        <!-- <div
          @click="changePath('history')"
          id="history-nav"
          ref="history-nav"
          class="icon uk-padding-small"
        >
          <span uk-icon="icon:history;ratio:1.5"></span>
          <small>History</small>
        </div> -->
      </div>
      <div id="offcanvas-slide" uk-offcanvas="overlay:true">
        <div
          class="
            uk-offcanvas-bar
            uk-padding-small
            uk-padding-remove-top
            uk-margin-small-top
            uk-margin-remove-top
            uk-padding-remove-left
            uk-padding-remove-right
          "
        >
          <ul class="uk-nav uk-nav-default uk-margin-small-top uk-background">
            <li
              class="
                uk-flex
                uk-text-left
                uk-flex-middle
                uk-background
                uk-margin-small-bottom
              "
              style="border-bottom: solid 1px #cccccc; height: 40px"
            >
              <a href="#offcanvas-slide">
                <span
                  class="
                    uk-padding-small
                    uk-padding-remove-top
                    uk-padding-remove-bottom
                    uk-margin-small-left
                    icon
                  "
                  style="color: black"
                  uk-icon="icon:menu;ratio:1.5"
                ></span></a
              ><img class="logo" src="/assets/kamylla_logo.png" />
            </li>
            <li id="take-offcanvas" ref="take-offcanvas">
              <a href="#offcanvas-slide" @click="changePath('take')">
                <span
                  class="uk-margin-left uk-margin-small-right icon"
                  uk-icon="icon:sign-in;ratio:1.5"
                ></span>
                <div class="uk-text-light">Take</div>
              </a>
            </li>
            <li id="return-offcanvas" ref="return-offcanvas">
              <a href="#offcanvas-slide" @click="changePath('return')">
                <span
                  class="uk-margin-left uk-margin-small-right icon"
                  uk-icon="icon:refresh;ratio:1.5"
                ></span>
                <div class="uk-text-light">Return</div></a
              >
            </li>
            <!-- COMMENTING OUT SEARCH AND HISTORY ICONS FOR NOW -->
            <!-- <li id="search-offcanvas" ref="search-offcanvas">
              <a href="#offcanvas-slide" @click="changePath('search')">
                <span
                  class="uk-margin-left uk-margin-small-right icon"
                  uk-icon="icon:search;ratio:1.5"
                ></span>
                <div class="uk-text-light">Search</div></a
              >
            </li>
            <li id="history-offcanvas" ref="history-offcanvas">
              <a href="#offcanvas-slide" @click="changePath('history')">
                <span
                  class="uk-margin-left uk-margin-small-right icon"
                  uk-icon="icon:history;ratio:1.5"
                ></span>
                <div class="uk-text-light">History</div></a
              >
            </li> -->
            <!-- <li class="uk-nav-divider"></li> -->
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { logout } from "../store/modules/accounts";
import { mapActions, mapState } from "vuex";

export default {
  name: "Navbar",
  data: function () {
    return {
      path: this.$router.currentRoute.path.split("/")[1],
    };
  },
  mounted() {
    //check valid user login
    //call checkValidAuthentication from accounts

    let dataPersistDict = [
      { key: "HISTORY", value: this.$store.state.accounts.history },
      { key: "CART", value: this.$store.state.cart.items },
      {
        key: "ACTIVE_LOCATION",
        value: this.$store.state.scanner.active_location,
      },
      { key: "LOCATIONS", value: this.$store.state.scanner.locations },
      { key: "CURRENT_PATH", value: this.$store.state.currentPath },
    ];

    window.localStorage.removeItem("LOCATIONS");

    for (let i = 0; i < dataPersistDict.length; i++) {
      localStorage.removeItem(dataPersistDict[i].key);
    }

    this.path = this.$router.currentRoute.path.split("/")[1];
    this.highlightActiveIcon();
  },
  beforeDestroy() {
    window.removeEventListener("click", this.setOffcanvas);
    window.removeEventListener("beforeunload", this.beforeWindowUnload);
  },
  beforeUpdate() {
    this.iconRefs = [];
  },
  created() {
    window.addEventListener("beforeunload", this.beforeWindowUnload);
  },
  computed: {
    ...mapState("cart", {
      cart: "cart",
      returnList: "returnList",
    }),
  },
  watch: {
    $route(newPath, oldPath) {
      this.path = newPath.path.split("/")[1];
      this.checkCartChanges(this.cart.length - 1);
      this.checkReturnListChanges(this.returnList.length - 1);
      this.highlightActiveIcon();
    },
  },

  methods: {
    ...mapActions(
      "cart",
      ["checkCartChanges", "checkReturnListChanges"],
      "accounts",
      ["logout", "logout"]
    ),
    beforeWindowUnload() {
      this.$store.dispatch("setLocalStorage", true);
    },
    changePath(path) {
      this.$router.push(`/${path}`);
      this.$store.state.currentPath = path;

      this.path = path;
      this.highlightActiveIcon();
    },
    highlightActiveIcon() {
      //fix this --> use scss variables
      for (var ref in this.$refs) {
        let el = this.$refs[ref];
        let elList = ref.split("-");

        if (elList[1] === "nav") {
          el.style.color = "black";
          if (elList[0] === this.path) el.style.color = "#1e87f0";
        } else {
          //offcanvas
          el.style.background = "none";
          el.children[0].children[0].style.color = "black";

          if (elList[0] === this.path) {
            el.style.background = "lightgray";
            el.children[0].children[0].style.color = "#1e87f0";
          }
        }
      }
    },
    logoutNav() {
      this.logout();

      this.changePath("");
    },
  },
};
</script>

<style scoped>
span {
  /* font-size: 30px; */
}

.uk-offcanvas-bar {
  background-color: white !important;
}

a {
  color: black !important;
  font-size: 20px;
}

.logo {
  width: 190px;
  /* background-color: lightgr */
}
</style>
