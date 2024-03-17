<template id="search">
  <div
    class="
      uk-height-1-1 uk-width-1-1 uk-background uk-align-center uk-margin-remove
    "
  >
    <div
      id="search-bar"
      ref="searchBar"
      class="
        uk-align-center uk-width-1-2 uk-padding-xsmall uk-margin-medium-top
      "
    >
      <div
        class="
          uk-flex
          uk-flex-center
          uk-flex-middle
          uk-height-1-1
          uk-width-1-1
          uk-padding-small
          uk-padding-remove-vertical
        "
      >
        <!-- <div class="uk-width-1-1 uk-margin-small-left"> -->
        <form
          class="uk-form uk-flex uk-flex-between uk-flex-middle uk-width-1-1"
          @submit="search"
        >
          <span uk-icon="icon: search; ratio: 1.2" />
          <input
            placeholder="Search in BOMIST"
            type="text"
            v-model="input"
            class="uk-input uk-width-1-1 uk-height-1-1"
            ref="searchInput"
            @click="highlightSearchBar()"
          />
          <a
            class="uk-button uk-button-default"
            href="#modal-center"
            uk-toggle
            uk-icon="icon: settings; ratio: 1.2"
          />

          <div id="modal-center" class="uk-flex-top" uk-modal>
            <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
              <button
                class="uk-modal-close-default"
                type="button"
                uk-close
              ></button>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </form>
        <!-- </div> -->
      </div>
    </div>
 <loader v-show="$store.state.showLoading" />
 <!-- $store.state.showLoading -->
    <div class="uk-height-1-1 uk-width-1-1 uk-background">
      <div
        class="
          uk-card
          uk-card-default
          uk-grid-collapse
          uk-child-width-1-2@s
          uk-margin
        "
        uk-grid
        v-for="part in outputs"
        :key="part.id"
      >
        <div class="uk-card-media-left uk-cover-container">
          <img :src="getImgUrl(part.thumbnail)" alt="" uk-cover />
          <canvas width="600" height="400"></canvas>
        </div>
        <div>
          <div class="uk-card-body">
            <!-- <h2 class="uk-card-title" style="font-size: 40px"> -->
            <h1 class="uk-heading-small uk-margin-remove-bottom">
              {{ part.description }}
            </h1>

            <!-- </h1> -->
            <h3>
              {{ part.label }}
            </h3>
            <div
              class="
                uk-flex
                uk-flex-column
                uk-text-left
                uk-padding-small
                uk-padding-remove-left
                uk-padding-remove-bottom
              "
            >
              <div>
                <strong>Stock: </strong>
                <span>{{ part.stock }}</span>
              </div>
              <div>
                <strong>MPN: </strong>
                <span>{{ part.mpn }} </span>
              </div>
              <div>
                <strong>IPN: </strong>
                <span>{{ part.ipn }} </span>
              </div>
              <div>
                <strong>Asset: </strong>
                <span> {{ part.asset }} </span>
              </div>
              <div>
                <strong>Consumable: </strong>
                <span> {{ part.consumable }} </span>
              </div>
              <div>
                <strong>Condition: </strong>
                <span
                  v-if="part.condition.toLowerCase() === 'good'"
                  class="uk-label uk-label-success"
                  >Good</span
                >
              </div>
              <div class="uk-margin-medium-top">
                <span class="uk-text-bold uk-margin-small-right uk-card-title"
                  >Currently borrowed by:</span
                >
                <span class="uk-text-lead">Timothy L.</span>
                <!-- <span v-for="storage in part.storage" :key="storage.id">
                  {{ storage.name }}
                  <span
                    v-if="
                      part.storage.findIndex(
                        (_storage) => _storage === storage
                      ) !==
                      part.storage.length - 1
                    "
                    >,</span
                  >
                </span> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bomist from "../scripts/api/bomist.js";
import * as constants from "../scripts/dictionary";
import Loader from "./Loader.vue";

export default {
  name: "Search",
  data: function () {
    return {
      input: "",
      outputs: [],
    };
  },
  mounted() {
    document.addEventListener("click", this.highlightSearchBar);
  },
  methods: {
    getImgUrl(fileName) {
      return require("../assets/" + fileName);
    },
    highlightSearchBar() {
      if (this.$refs.searchInput === document.activeElement) {
        this.$refs.searchBar.style.background = "white";
        this.$refs.searchBar.classList.add("focus");
      } else {
        this.$refs.searchBar.style.background = "#f1f3f4";
        this.$refs.searchBar.classList.remove("focus");
      }
    },
    async search(event) {
    
      this.$store.commit(constants.LOADER_SHOW_MUTATION, true);//show loading
      event.preventDefault();

      let URL = constants.ENDPOINT + constants.SEARCH_PATH;
      let data = { selector: { "part.description": this.input } };

      let response = await bomist.postData(URL, data);
      console.log("response: ", response);

      for (let i = 0; i < response.length; i++) {
        let fields = await bomist.getPartFields(response[i].part.id); //seems redundant but we need to call the API anyway to obtain the label name

        for (let s = 0; s < fields.storage.length; s++) {
          let storageFields = await bomist.getStorageFields(fields.storage[s]);

          fields.storage[s] = storageFields;
        }

        this.outputs.push(fields);
      }

      console.log("Output: ", this.outputs);
 //Hide alert after function is complete
  this.$store.commit(constants.LOADER_SHOW_MUTATION, false)
    },
  },
  components: {
    Loader
  }
};
</script>

<style scoped>
input {
  background: transparent;
  border: none;
}

input:focus {
  background: transparent;
}

#search-bar {
  background: #f1f3f4;
  transition: 0.3s;
  border-radius: 10px;
  height: 60px;
}

#search-bar.focus {
  /* box-shadow: outset 1px 1px 6px rgb(0 0 0 / 10%); */
  /* inset 0 -1px 0 rgb(0 0 0 / 7%); */
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
}

img {
  width: 400px !important;
  height: 350px !important;
}
</style>
