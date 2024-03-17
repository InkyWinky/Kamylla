<template>
  <div class="Icon">
    <!-- Icons on the right code -->
    <!-- <div class="iconDiv">
      <p v-show="showHidden" class="hiddenInfo">{{ hiddenInfo }}</p>
      <div v-show="showScanAuthcate" class="imgWrapper">
        <div class="scanBar"></div>
        <img
          class="icon"
          src="../../public/icons/scanAuthcate.png"
          alt="scan Authcate Icon"
          @click="hideShowHiddenInfo"
        />
      </div>

      <div v-show="showScanLocation" class="imgWrapper">
        <div class="scanBar"></div>
        <img
          class="icon"
          src="../../public/icons/scanLocation.png"
          alt="scan Location Icon"
          @click="hideShowHiddenInfo"
        />
      </div>
      <div v-show="showScanItem" class="imgWrapper">
        <div class="scanBar"></div>
        <img
          class="icon"
          src="../../public/icons/scanPart.png"
          alt="scan Item Icon"
          @click="hideShowHiddenInfo"
        />
      </div>
    </div> -->
    <div class="iconDiv">
      <p v-show="showHidden" class="hiddenInfo">{{ hiddenInfo }}</p>
      <div v-show="showScanAuthcate" class="imgWrapper">
        <div class="scanBar"></div>
        <img
          class="icon"
          src="../../public/icons/scanAuthcate.png"
          alt="scan Authcate Icon"
          @click="hideShowHiddenInfo"
        />
      </div>

      <div v-show="showScanLocation" class="imgWrapper">
        <div class="scanBar"></div>
        <img
          class="icon"
          src="../../public/icons/scanLocation.png"
          alt="scan Location Icon"
          @click="hideShowHiddenInfo"
        />
      </div>
      <div v-show="showScanItem" class="imgWrapper">
        <div class="scanBar"></div>
        <img
          class="icon"
          src="../../public/icons/scanPart.png"
          alt="scan Item Icon"
          @click="hideShowHiddenInfo"
        />
      </div>
      <div v-show="showScanItemAndLocation" class="imgWrapper">
        <div class="scanBar"></div>
        <!-- <img
          class="icon"
          src="../../public/icons/scanPartAndLocationIcon.png"
          alt="scan Item Icon"
          @click="hideShowHiddenInfo"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ACTIVE_LOCATION_KEY } from "../scripts/dictionary";
import { mapState, mapGetters } from "vuex";
import store from "../store";
export default {
  data: function () {
    return {
      iconType: "",
      showHidden: false,
      hiddenInfo: "",
      showScanAuthcate: false,
      showScanLocation: false,
      showScanItem: false,
      showScanItemAndLocation: false,
    };
  },

  mounted() {
    this.detectTypeOfIcon();
  },
  watch: {
    $route(to, from) {
      this.detectTypeOfIcon();
    },
    active_location(newLoc, oldLoc) {
      this.detectTypeOfIcon();
    },
    locations(newLoc, oldLoc) {
      this.detectTypeOfIcon();
    },
    tabState(newTab, oldTab) {
      this.detectTypeOfIcon();
    },
  },
  methods: {
    hideShowHiddenInfo() {
      if (this.showHidden) {
        this.showHidden = false;
      } else {
        this.showHidden = true;
      }
    },
    detectTypeOfIcon() {
      if (this.$router.currentRoute.path === "/") {
        this.showScanAuthcate = true;
        this.showScanLocation = false;
        this.showScanItem = false;
        this.showScanItemAndLocation = false;
        this.hiddenInfo = "Scan user ID";
      } else if (this.$router.currentRoute.path === "/take") {
        this.showScanLocation = true;
        this.showScanAuthcate = false;
        this.showScanItem = false;
        this.showScanItemAndLocation = false;
        this.hiddenInfo = "Scan location barcode";
        console.log("tabstate: " + store.state.tabState);
        if (store.state.tabState !== 0) {
          this.showScanItem = false;
          this.showScanLocation = false;
          this.showScanItemAndLocation = true;
          this.hiddenInfo = "Scan location or item barcode";
        }
      } else if (this.$router.currentRoute.path === "/return") {
        if (store.state.tabState !== 5) {
          this.showScanLocation = false;
          this.showScanAuthcate = false;
          this.showScanItemAndLocation = false;
          this.showScanItem = true;
          this.hiddenInfo = "Scan item barcode";
        }
        if (store.state.tabState === 5) {
          this.showScanLocation = false;
          this.showScanItem = false;
          this.showScanItemAndLocation = true;
          this.hiddenInfo += " or location barcode";
        }
      } else {
        this.showScanLocation = false;
        this.showScanItemAndLocation = false;
        this.showScanAuthcate = false;
        this.showScanItem = false;
      }
    },
  },
  computed: {
    ...mapState("scanner", {
      active_location: "active_location",
      locations: "locations",
    }),
    ...mapGetters({
      tabState: "tabState",
    }),
  },
};
</script>

<style lang="css" scoped>
.icon {
  height: 7vh;
  width: auto;
  filter: opacity(50%);
}
.iconDiv {
  position: absolute;
  bottom: 1vh;
  /* right: 1vw; for bottom right*/
  left: 0;
  z-index: 9999;
  text-align: center;
}
.scanBar {
  height: 5px;
  background-color: red;
  width: 100%;
  position: absolute;
  animation-iteration-count: infinite;
  animation-name: scan;
  animation-duration: 5s;
  transition: ease;
}
.imgWrapper {
  position: relative;
  display: inline-block;
  margin: 10px;
}
.hiddenInfo {
  /* display: none; */
  position: absolute;
  width: 500%;
  height: 100%;
  right: 100%;
  bottom: 0;
  top: 25%;
  padding: 5px;
  text-align: right;
  vertical-align: middle;
  color: grey;
}
@keyframes scan {
  0% {
    top: 0;
  }
  25% {
    top: 90%;
  }
  50% {
    top: 0;
  }
  75% {
    top: 90%;
  }
  100% {
    top: 0;
  }
}
</style>
