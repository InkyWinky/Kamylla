import Vue from "vue";
import Vuex from "vuex";

import accounts from "./modules/accounts";
import cart from "./modules/cart.js";
import scanner from "./modules/scanner";

import * as constants from "../scripts/dictionary";

Vue.use(Vuex);
//Websocket connection and error msgs
connectToWebsocket();

function connectToWebsocket() {
  try {
    const connection = new WebSocket(constants.WEB_SOCKET_SERVER);
    connection.onmessage = (event) =>
      store.dispatch("handleSocketMessage", event); // calls handleSocketMessage with argument of event

    connection.onopen = (event) => {
      console.log("OPEN: ", event);
      store.commit(constants.ALERT_SHOW_MUTATION, false);
    };
    connection.onclose = (event) => {
      console.log("CLOSED: ", event);
      store.commit(constants.ALERT_SHOW_MUTATION, true);
      store.commit(
        constants.ALERT_MSG_MUTATION,
        constants.WEB_SOCKET_CLOSE_MSG
      );
      connectToWebsocket();
    };
  } catch (err) {
    store.commit(constants.ALERT_SHOW_MUTATION, true);
    store.commit(constants.ALERT_MSG_MUTATION, constants.WEB_SOCKET_CLOSE_MSG);
  }
}
// const connection = new WebSocket(WEB_SOCKET_SERVER);
// connection.on('open',()=>console.log('test'));
// setInterval(()=>{const connection =new WebSocket(WEB_SOCKET_SERVER);})
// function connectToWebsocket(webSocketServer){
// const connection = new WebSocket(WEB_SOCKET_SERVER);
// connection.onmessage = (event) => store.dispatch("handleSocketMessage", event); // calls handleSocketMessage with argument of event

// connection.onopen = (event) => {
//   console.log("OPEN: ", event);
//   store.commit(ALERT_SHOW_MUTATION, false);
// };

// connection.onclose = (event) => {
//   console.log("CLOSED: ", event);
//   store.commit(ALERT_SHOW_MUTATION, true);
//   store.commit(ALERT_MSG_MUTATION, WEB_SOCKET_CLOSE_MSG);
//   setInterval()
// };
// connection.addEventListener('open', (event) => {
//   console.log("open AddeventList-ver");
//   store.commit(ALERT_SHOW_MUTATION, false);
// });
const store = new Vuex.Store({
  state: {
    currentPath: "",
    idle: false,
    showLoading: false,          
    showAlert: false,
    alertMsg: "",
    tabState: 0,
    noConfirm: false
  },
  getters: {
    idle: (state) => {
      return state.idle;
    },
    tabState: (state) => state.tabState,
  },
  actions: {
    handleSocketMessage({ state, rootState, dispatch }, event) {
      // assign scanned data from websocket message event to recentScan in store. Changes in recentScan is detected in watch.
      dispatch("scanner/processScan", event.data, { root: true });
    },
    setLocalStorage({ state }, set = true) {
      console.log("Setting Local Storage", set);
      let dataPersistDict = [
        // { key: constants.HISTORY_KEY, value: state.accounts.history },
        { key: constants.CART_KEY, value: state.cart.cart },
        {
          key: constants.ACTIVE_LOCATION_KEY,
          value: state.scanner.activeLocation,
        },
        { key: constants.LOCATIONS_KEY, value: state.scanner.locations },
        { key: constants.CURRENT_PATH_KEY, value: state.currentPath },
        { key: constants.RETURN_LIST_KEY, value: state.cart.returnList },
        { key: constants.CURRENT_USER_KEY, value: state.accounts.currentUser },
        {
          key: constants.RECENTLY_LOGGED_USERS_KEY,
          value: state.accounts.pastUsers,
        },
      ];

      console.log(state.accounts.pastUsers);

      for (let i = 0; i < dataPersistDict.length; i++) {
        if (set) {
          if (dataPersistDict[i].value !== undefined) {
            //check if it's undefined
            localStorage.setItem(
              dataPersistDict[i].key,
              JSON.stringify(dataPersistDict[i].value)
            );
          } else {
            console.log("it didn't worked");
            localStorage.setItem(dataPersistDict[i].key, "[]");
          }
        } else {
          localStorage.removeItem(
            dataPersistDict[i].key,
            JSON.stringify(dataPersistDict[i].value)
          );
        }
      }
    },
    resetStore({ commit }) {
      commit("cart/resetState", null, { root: true });
      commit("accounts/resetState", null, { root: true });
      commit("scanner/resetState", null, { root: true });
    },
  },
  modules: {
    accounts,
    cart,
    scanner,
  },
  mutations: {
    [constants.LOADER_SHOW_MUTATION](state, payload) {
      state.showLoading = payload;
    },
    [constants.ALERT_SHOW_MUTATION](state, payload) {
      state.showAlert = payload;
    },
    [constants.ALERT_MSG_MUTATION](state, msg) {
      state.alertMsg = msg;
    },
    [constants.ICON_TAB_MUTATION](state, tabNo) {
      state.tabState = tabNo;
    },
    [constants.CONFIRM_MUTATION](state, payload) {
      state.noConfirm = payload;
    },
  },
});

export default store;