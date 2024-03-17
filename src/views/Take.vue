<template id="take">
  <div class="uk-height-1-1 uk-width-1-1">
    <ul uk-tab id="tab-list" class="uk-width-1-1 uk-margin-remove">
      <li
        class="
          uk-width-1-3
          uk-background-muted
          uk-flex
          uk-text-left
          uk-padding-remove
        "
      >
        <a href="#" class="uk-width-1-1" @click="changeTabState(0)"
          ><span uk-icon="icon:list" class="uk-margin-small-right" /> Locations
          <div class="uk-width-expand"
        /></a>
      </li>
      <li
        class="
          uk-width-1-3
          uk-background-muted
          uk-flex
          uk-text-left
          uk-margin-left-remove
          uk-padding-remove
        "
      >
        <a
          href="#"
          class="uk-flex-1 uk-margin-left-remove"
          @click="changeTabState(1)"
          ><span uk-icon="icon:location" class="uk-margin-small-right" /> Current
          Location:
          {{
            activeLocation.fullName !== undefined
              ? activeLocation.fullName
              : "not scanned"
          }}
          <div class="uk-width-expand" />
        </a>
      </li>
      <li
        class="
          uk-width-1-3
          uk-flex
          uk-text-left
          uk-background-muted
          uk-padding-remove
        "
      >
        <a href="#" class="uk-width-1-1" @click="changeTabState(2)"
          ><span uk-icon="icon:cart" class="uk-margin-small-right" />Cart
          <div class="uk-width-expand"
        /></a>
      </li>
    </ul>

    <ul class="uk-switcher">
      <li id="locations" class="uk-padding-small">
        <div id="locations" class="list uk-padding uk-padding-remove-top">
          <h3
            v-if="locations.length === 0"
            class="uk-text-lead uk-text-large"
            style="margin-top: 30vh"
          >
            To start taking parts, scan a location
            <Alert v-show="$store.state.showAlert" />
          </h3>

          <div v-else class="container">
            <div
              v-for="location in locations"
              :key="location.id"
              class="
                uk-card
                uk-card-default
                uk-grid-collapse
                uk-child-width-1-2@s
                uk-margin
              "
              uk-grid
            >
              <div
                class="uk-flex-last@s uk-card-media-right uk-cover-container"
              >
                <canvas width="600" height="100"></canvas>
              </div>
              <div
                @click="changeActiveLocation(location)"
                class="uk-card-body uk-text-left uk-padding"
              >
                <h3 class="uk-card-title">{{ location.fullName }}</h3>
              </div>
            </div>
            <Alert v-show="$store.state.showAlert" />
          </div>
        </div>
      </li>

      <li id="parts" class="uk-background uk-padding-small">
        <h3 class="uk-text-center">
          {{
            this.activeLocation.length === 0
              ? "No location selected"
              : "To take parts, either press a part row or scan a part"
          }}
        </h3>

        <div
          v-if="this.activeLocation.length !== 0"
          class="uk-overflow-auto"
          style="height: 100vh"
        >
          <table
            class="
              list
              uk-width-1-1 uk-table uk-table-hover uk-table-divider uk-text-left
            "
          >
            <thead>
              <tr>
                <th class="uk-table-shrink">Label</th>
                <th class="uk-table-expand">Description</th>
                <th class="">Consumable</th>
                <th class="">Stock</th>
              </tr>
            </thead>

            <tbody>
              <Loader v-if="showLoading" />
              <Loader v-if="showLoading" />
              <tr
                v-for="part in activeLocation.parts"
                :key="part.id"
                @click="addPartToCart(part)"
              >
                <td>{{ part.label }}</td>
                <td>
                  {{ part.description }}
                </td>
                <td v-if="part.consumable">
                  <span uk-icon="icon:bag"></span>
                </td>
                <td v-else-if="part.asset"><span uk-icon="icon:tag"></span></td>
                <td v-else></td>
                <td>
                  <div>
                    {{ part.stock }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Alert v-show="$store.state.showAlert" />
        </div>
      </li>

      <li id="shopping-cart" class="uk-padding-small">
        <h3 class="uk-margin-remove">Scan another part/location to continue</h3>
        <div
          v-if="this.cart.length > 0"
          class="uk-overflow-auto uk-height-viewport uk-background"
        >
          <table
            class="
              uk-table
              uk-width-1-1
              uk-table-hover
              uk-table-middle
              uk-table-divider
            "
          >
            <thead>
              <tr class="">
                <th class=""></th>
                <!-- <th class=""></th> -->
                <th
                  class="
                    uk-table-expand
                    uk-background
                    uk-padding-remove
                    uk-margin-left-remove
                  "
                >
                  Description
                </th>
                <!-- <th class="uk-width-small">Consumable</th> -->
                <th class="uk-table-shrink uk-padding-remove uk-text-center">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="part in cart" :key="part.id" class="uk-background-">
                <!-- <td><input class="uk-checkbox" type="checkbox"></td> -->
                <td @click="deletePart(part)" class="uk-padding-remove">
                  <div class="uk-flex uk-flex-center">
                    <a href="#" class="uk-link-text">
                      <span
                        uk-icon="icon:trash;ratio:1.3"
                        class="uk-icon-button"
                      />
                    </a>
                  </div>
                </td>
                <!-- <td>
                  <img
                    class="uk-preserve-width uk-border-circle"
                    :src="getImgUrl(part.thumbnail)"
                    width="40"
                    alt=""
                  />
                </td> -->
                <td class="uk-table-link uk-text-left">
                  <div class="uk-flex uk-flex-column">
                    <div>{{ part.description }}</div>
                    <div
                      class="uk-flex uk-flex-row uk-text-small uk-background-"
                    >
                      <div>
                        <strong>Taken from:</strong>
                        {{ part.location.fullName }}
                      </div>
                      <div v-if="part.asset" class="uk-margin-left">
                        <strong>Condition: </strong>
                        <span
                          v-if="part.condition === 'good'"
                          class="uk-label uk-label-success"
                          >Good</span
                        >
                        <span
                          v-else-if="part.condition === 'needs-testing'"
                          class="uk-label uk-label-warning"
                          >Needs Testing</span
                        >
                        <span
                          v-else-if="part.condition === 'damaged'"
                          class="uk-label uk-label-danger"
                          >Damaged</span
                        >
                        <span
                          v-else-if="part.condition === 'broken'"
                          class="uk-label uk-label-danger"
                          >Broken</span
                        >
                        <span
                          v-else-if="part.condition === null"
                          class="uk-label uk-label-danger"
                          >No Condition</span
                        >
                      </div>
                    </div>
                  </div>
                </td>
                <!-- <td v-if="part.consumable">
                  <div uk-icon="icon:check"></div>
                </td>
                <td v-else></td> -->
                <td class="">
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
                      {{ part.quantity }}
                    </span>
                    <div class="">
                      <span
                        uk-icon="icon:plus; ratio:1.2"
                        class="uk-icon-button"
                        @click="incrementQty(part)"
                      ></span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Alert v-show="$store.state.showAlert" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import UIkit from "uikit";

import { mapState, mapActions, mapGetters } from "vuex";
import bomist from "../scripts/api/bomist";
import Loader from "./Loader.vue";
import Alert from "./Alert.vue";
import store from "../store";
import { ALERT_SHOW_MUTATION, ICON_TAB_MUTATION } from "../scripts/dictionary";

export default {
  components: {
    Loader,
    Alert,
  },
  name: "Take",
  data: function () {
    return {
      inputLocation: "",
      tabs: { locations: 0, parts: 1, cart: 2 },
    };
  },
  computed: {
    ...mapState("cart", {
      cart: "cart",
    }),
    ...mapState("scanner", {
      activeLocation: "activeLocation",
      locations: "locations",
      recentScan: "recentScan",
    }),
    ...mapState({
      showLoading: (state) => state.showLoading,
      showAlert: (state) => state.showAlert,
      alertMsg: (state) => state.alertMsg,
    }),
  },
  mounted() {},

  watch: {
    //listens for any variable changes
    activeLocation(newLoc, oldLoc) {
      //change the active tab
      UIkit.switcher("#tab-list").show(1);
      store.commit(ICON_TAB_MUTATION, 1);
    },
    cart: {
      handler: (newCart, oldCart) => {
        UIkit.switcher("#tab-list").show(2);
        store.commit(ICON_TAB_MUTATION, 2);
      },
      deep: true,
    },
  },

  methods: {
    //map the actions from store modules to be used with this.method()
    ...mapActions("cart", ["addPartToCart", "checkCartChanges", "deletePart"]),
    ...mapActions("scanner", ["scanLocation", "changeActiveLocation"]),
    ...mapActions("accounts", ["logout"]),

    decrementQty(part) {
      if (part.quantity > 0) {
        part.quantity -= 1;
      }
    },
    incrementQty(part) {
      if (part.quantity < part.stock) {
        part.quantity += 1;
      }
    },
    changeTabState(tabNo) {
      store.commit(ICON_TAB_MUTATION, tabNo);
      store.commit(ALERT_SHOW_MUTATION, false);
    },
    getImgUrl(fileName) {
      console.log(fileName);
      return require("../assets/" + fileName);
    },
  },
};
</script>

<style scoped>
h3 {
  color: gray;
}
</style>
