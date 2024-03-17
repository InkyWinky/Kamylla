<template id="return">
  <div
    id="pages"
    class="
      uk-align-center
      uk-height-viewport
      uk-background
      uk-height-1-1
      uk-width-1-1
      uk-padding-small
      uk-flex
      uk-flex-column
    "
  >
    <!--page 1 !-->
    <div id="list" class="page">
      <h1
        v-if="returnList.length === 0"
        class="
          uk-heading-xsmall
          uk-align-center
          uk-display-inline
          uk-margin-small-top
        "
      >
        <!-- To return an part, scan it mate -->
        <h3
          v-if="this.returnList.length === 0"
          class="uk-text-lead uk-text-large"
          style="margin-top: 30vh"
        >
          To start returning, scan a part
          <!-- <Alert v-show="$store.state.showAlert" /> -->
        </h3>
      </h1>
      <Alert v-show="$store.state.showAlert" />
      <div class="uk-overflow-auto uk-height-viewport">
        <table
          v-if="returnList.length > 0"
          class="
            uk-width-1-1
            uk-table
            uk-table-hover
            uk-table-divider
            uk-table-middle
            uk-text-left
          "
        >
          <thead>
            <tr>
              <th class="uk-table-shrink">Undo</th>
              <th class="uk-table-shrink">Label</th>
              <th class="uk-table-expand">Description</th>
              <th class="">Location</th>
              <th class="uk-table-shrink uk-text-center">Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="part in returnList" :key="part.id">
              <td @click="undoReturn(part)">
                <span uk-icon="icon:refresh" class="uk-icon-button" />
              </td>
              <td>{{ part.label }}</td>
              <td>
                {{ part.description }}
              </td>
              <td class="uk-flex uk-flex-column">
                <div>
                  {{ part.returnToLocation?
                 part.returnToLocation.fullName:
                  "none" }}
                </div>
                <div class="uk-text-meta">
                  From: {{ part.returnFromLocation.name }}
                </div>
              </td>
              <!-- <div class="uk-flex uk-flex-column">
                    <div>{{ part.description }}</div>
                    <div
                      class="uk-flex uk-flex-row uk-text-small uk-background-"
                    >
                      <div>
                        <strong>Taken from:</strong>
                        {{ part.location.fullName }}
                      </div> -->
              <td>
                <div class="uk-flex uk-flex-center uk-background uk-flex-row">
                  <span
                    uk-icon="icon:minus;ratio:1.2"
                    class="uk-icon-button"
                    @click="decrementQty(part)"
                  ></span>
                  <span
                    class="
                      uk-padding-small
                      uk-padding-remove-top
                      uk-padding-remove-bottom
                      uk-margin-auto
                      uk-text-large
                    "
                  >
                    {{ part.qty }}
                  </span>
                  <div class="">
                    <span
                      uk-icon="icon:plus; ratio:1.2"
                      class="uk-icon-button"
                      @click="incrementQty(part, $store.state.noConfirm)"
                    ></span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Alert v-show="$store.state.showAlert" />
    </div>

    <div
      v-if="partToReturn !== null"
      id="part-popup"
      class="page uk-padding uk-position-center uk-width"
    >
      <div
        class="
          uk-card
          uk-card-default
          uk-grid-collapse
          uk-child-width-1-2@s
          uk-margin
        "
        uk-grid
      >
        <div class="uk-card-media-left uk-cover-container">
          <img :src="getImgUrl(partToReturn.thumbnail)" alt="" uk-cover />
          <canvas width="600" height="400"></canvas>
        </div>
        <div class="uk-background">
          <div
            class="
              uk-card-body
              uk-text-left
              uk-background
              uk-height-1-1
              uk-flex
              uk-flex-column
            "
          >
            <h1 class="uk-heading-small">Return Item</h1>

            <h3>
              {{ partToReturn.description }}
            </h3>

            <h3 class="uk-card-title">
              <strong>Quantity: </strong>
              <span
                uk-icon="icon:minus; ratio:1.2"
                class="uk-icon-button"
                @click="decrementQty(partToReturn)"
              ></span>

              <span
                class="
                  uk-border-rounded
                  uk-padding-small
                  uk-padding-remove-top
                  uk-padding-remove-bottom
                  uk-margin-left
                  uk-margin-right
                "
                style="border: solid 1px black"
                >{{ partToReturn.qty }}</span
              >
              <span
                uk-icon="icon:plus; ratio:1.2"
                class="uk-icon-button"
                @click="incrementQty(partToReturn, $store.state.noConfirm)"
              ></span>
            </h3>
            <div class="uk-flex uk-flex-row uk-flex-middle uk-margin-bottom">
              <h3
                class="
                  uk-card-title
                  uk-height-1-1
                  uk-margin-remove-bottom
                  uk-margin-right
                "
              >
                <strong class="">From: </strong>
              </h3>

              <input
                class="uk-input uk-form-width-medium uk-margin-small-right"
                type="text"
                placeholder="disabled"
                v-model="this.partToReturn.returnFromLocation.name"
                disabled
              />

              <button
                class="uk-button uk-button-default uk-margin-small-right"
                type="button"
                uk-toggle="target: #modal__user-locations"
              >
                Browse...
              </button>
            </div>

            <div class="uk-flex uk-flex-row uk-flex-middle uk-margin-bottom">
              <h3
                class="
                  uk-card-title
                  uk-height-1-1
                  uk-margin-remove-bottom
                  uk-margin-right
                "
              >
                <strong class="">To: </strong>
              </h3>

              <input
                class="uk-input uk-form-width-medium uk-margin-small-right"
                type="text"
                placeholder="disabled"
                v-model="this.partToReturn.returnToLocation.fullName"
                disabled
              />

              <button
                class="uk-button uk-button-default uk-margin-small-right"
                type="button"
                uk-toggle="target: #modal__storage-locations"
              >
                Browse...
              </button>
            </div>

            <!-- Modal for Returning from -->
            <div id="modal__user-locations" uk-modal>
              <div class="uk-modal-dialog uk-modal-body">
                <button
                  class="uk-modal-close-default"
                  type="button"
                  uk-close
                ></button>

                <h2 class="uk-modal-title">Return from...</h2>
                <div
                  class="
                    uk-grid-column-small
                    uk-grid-row-small
                    uk-child-width-1-3@s
                    uk-text-center
                  "
                  uk-grid
                >
                  <div
                    v-for="location in this.userLocations"
                    :key="location.id"
                  >
                    <div
                      class="uk-card uk-card-default uk-card-body"
                      v-bind:class="{
                        'uk-card-primary':
                          location.storage.id === partToReturn.returnFromLocation.storage.id,
                      }"
                      @click="changeReturnFromLocation(location)"
                    >
                      {{ location.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal for Returning To -->
            <div id="modal__storage-locations" uk-modal>
              <div class="uk-modal-dialog uk-modal-body">
                <button
                  class="uk-modal-close-default"
                  type="button"
                  uk-close
                ></button>
                <h2 class="uk-modal-title">Return to...</h2>
                <div
                  class="
                    uk-grid-column-small
                    uk-grid-row-small
                    uk-child-width-1-3@s
                    uk-text-center
                  "
                  uk-grid
                >
                  <div
                    v-for="location in this.storageLocations"
                    :key="location.id"
                  >
                    <div
                      class="uk-card uk-card-default uk-card-body"
                      v-bind:class="{
                        'uk-card-primary':
                          location.id === partToReturn.returnToLocation.id,
                      }"
                      @click="changeReturnToLocation(location)"
                    >
                      {{ location.fullName }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- {{ this.returnTo }} -->
            <!-- <ul class="uk-grid uk-grid-small">
              <li v-for="location in partToReturn.locations" :key="location.id">
                <a
                  @click="setReturnLocation(location)"
                  v-bind:class="{
                    'uk-background-primary': location.selected,
                  }"
                  v-if="!location.fullName.startsWith('User')"
                  class="
                    uk-background-muted uk-padding-xsmall uk-border-rounded
                  "
                  :load="log('location: ', location)"
                  >{{ location.fullName }}</a
                >
              </li>
            </ul> -->
          </div>
        </div>
      </div>
      <Alert v-show="$store.state.showAlert" />

      <div
        class="
          buttons
          uk-flex uk-flex-row uk-background uk-flex-middle uk-flex-around
        "
      >
        <button @click="abortReturn()" class="uk-button uk-button-secondary">
          Cancel
        </button>

        <button @click="returnPart()" class="uk-button uk-button-primary">
          Done
        </button>
      </div>
    </div>
    <div
      v-if="$store.state.showLoading"
      id="part-popup"
      class="page uk-padding uk-position-center uk-width uk-card-large"
      style="height: 400px; background-color: white; padding: 100px"
    >
      <loader v-show="$store.state.showLoading" />
    </div>
  </div>
</template>

<script>
//Imports
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import Alert from "./Alert.vue";
import Loader from "./Loader.vue";
import store from "../store";
import { CONFIRM_MUTATION, ICON_TAB_MUTATION } from "../scripts/dictionary.js";
import Vue from 'vue';
import Swal from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(Swal);

export default {
  name: "Return",
  data: function () {
    return {
      inputPart: "",
      form: "",
    };
  },
  computed: {
    ...mapState("accounts", {
      currentUserID: "currentUserID",
      currentUser: "currentUser",
    }),
    ...mapState("scanner", {
      recentScan: "recentScan",
      partToReturn: "partToReturn",
    }),
    ...mapState("cart", {
      returnList: "returnList",
    }),
    ...mapState({
      showLoading: (state) => state.showLoading,
      showAlert: (state) => state.showAlert,
      alertMsg: (state) => state.alertMsg,
    }),

    userLocations: function () {
      return this.partToReturn.locations.filter((location) =>
        location.fullName.startsWith("User")
      );
    },
    storageLocations: function () {
      return this.partToReturn.locations.filter(
        (location) => !location.fullName.startsWith("User")
      );
    },
  },
  watch: {
    "partToReturn.returnFromLocation": function () {
      this.partToReturn.qty = 1;
    },
  },
  methods: {
    ...mapActions("cart", ["addPartToReturnList", "undoReturn"]),
    abortReturn() {
      this.$store.state.scanner.partToReturn = null;
    },
    changeLocationButton(location) {
      this.setReturnLocation(location);
      // this.
    },

    decrementQty(part) {
      if (part.qty > 0) {
        part.qty -= 1;
      }
    },
    incrementQty(part, noConfirm = false) {
      //restrict the amount the user is allowed to return
      //Don't restrict: allow users to return consumable items
      if (part.qty < part.returnFromLocation.qty || noConfirm === true) {
  
        part.qty += 1;
      }

      else {
        //display message telling user they can't return any more
        //Make a better pop up at some point
          this.$swal.fire({
          imageUrl: '../../icons/magicHat3.gif',
          imageWidth:150,
          imageHeight:150,
          title: "Do you wish to proceed?",
          showCancelButton: true,
          text: "You're about to return a consumable part or return more than is available in your user location.",
        }).then((result) => {
  if (result.isConfirmed) {
    part.qty+=1
    this.setNoConfirm(true)
  }
})
        
      }
    },
    returnPart() {
      console.log("returning...");
        store.commit(CONFIRM_MUTATION, false)
      this.addPartToReturnList();
    },
    setReturnLocation(location) {
      this.partToReturn.locations.forEach((location) => {
        location.selected = false;
      });

      location.selected = true;
    },
    changeTabState(tabNo) {
      store.commit(ICON_TAB_MUTATION, tabNo);
    },
    getImgUrl(fileName) {
      return require("../assets/" + fileName);
    },
    changeReturnFromLocation(location) {
      this.partToReturn.returnFromLocation = location;
    },
    changeReturnToLocation(location) {
      this.partToReturn.returnToLocation = location;
    },
    setNoConfirm(bool) {
      store.commit(CONFIRM_MUTATION, bool);
    }
  },
  components: {
    Alert,
    Loader,
  },
};
</script>

<style scoped>
.uk-label-success {
  border-radius: 15px;
}

a {
  color: black;
}

h3 {
  color: gray;
}
</style>
