<template id="login">
  <div
    class="
      uk-flex
      uk-flex-center
      uk-align-middle
      uk-flex-middle
      uk-background
      uk-height-viewport
    "
  >
    <div
      class="
        uk-margin
        uk-align-center
        uk-card
        uk-card-body
        uk-card-default
        uk-border-rounded
        uk-flex
        uk-flex-column
        uk-width-1-1
        uk-width-large@s
      "
    >
      <div>
        <img class="uk-width-medium" src="/assets/kamylla_logo.png" />
      </div>
      <div
        class="
          uk-background
          uk-flex
          uk-flex-column
          uk-margin-top
          uk-panel
          uk-panel-box
        "
        style="background: none"
      >
        <div
          class="
            uk-margin-large-top uk-margin-remove-bottom uk-padding-remove-bottom
          "
        >
          <form @submit="processLoginInput(authcate)">
            <div class="uk-margin-bottom" style="background: none">
              <input
                class="uk-input uk-form-width-large uk-form-large"
                type="text"
                v-model="authcate"
                placeholder="Enter authcate"
              />
            </div>
            <!-- Error message area -->
            <Alert v-show="$store.state.showAlert" />
            <div id="error-message-area" v-if="showLoginError">
              <div class="uk-alert-danger" uk-alert>
                <!-- <a class="uk-alert-close" uk-close></a> Close button removes the entire element, not desirable-->
                <p>{{ loginErrorMessage }}</p>
              </div>
            </div>
            <div class="uk-margin-top">
              <button class="uk-button uk-button-primary uk-align-center">
                Log in
              </button>
            </div>
          </form>

          <!-- <div 
            class="
              uk-text-left
              uk-card-body
              uk-flex
              uk-flex-middle
              uk-text-large
              uk-alert-danger
              uk-text-bold
              uk-padding-small
              uk-width-expand
              
              " uk-alert
              id="alert-message"
          >
            <p><button type="button" uk-close></button>&nbsp;&nbsp; {{userLoginError}}</p>
            <a class="uk-alert-close" id="error-message" uk-close></a>
            <p>{{loginErrorMsg}}</p>
          </div> -->
        </div>
        <div
          class="
            uk-background
            uk-text-left
            uk-align-center
            uk-margin-auto
            uk-visible@s
          "
        >
          <b>Recent users</b>
          <div class="uk-grid uk-grid-small uk-text-center" uk-grid>
            <a
              v-for="user in pastUsers"
              :key="user"
              @click="processLoginInput(user)"
              class="text-decoration-none"
              href="#"
              ><strong class="uk-text-small uk-background uk-width-1-5">{{
                user
              }}</strong></a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Alert from "./Alert.vue";

export default {
  name: "Login",
  data: function () {
    return {
      authcate: "",
    };
  },
  computed: {
    ...mapState("accounts", {
      pastUsers: "pastUsers",
      loginErrorMessage: "loginErrorMessage",
      showLoginError: "showLoginError",
    }),
  },
  mounted() {
    console.log("mounted");
    this.logout();
  },
  methods: {
    ...mapActions("accounts", ["processLoginInput", "logout"]),
  },
  components: {
    Alert,
  },
};
</script>

<style scoped></style>
