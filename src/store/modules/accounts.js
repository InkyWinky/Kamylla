import { router } from "../../main";
import bomist from "../../scripts/api/bomist";
import * as constants from "../../scripts/dictionary";
import store from "../../store";
const getDefaultState = () => {
  return {
    currentUser: {},
    pastUsers:
      localStorage.getItem(constants.RECENTLY_LOGGED_USERS_KEY) === null
        ? []
        : JSON.parse(localStorage.getItem(constants.RECENTLY_LOGGED_USERS_KEY)),

    history: localStorage.getItem(constants.HISTORY_KEY),
    loginErrorMessage: "empty",
    showLoginError: false,
  };
};

const state = () => ({
  currentUser: JSON.parse(localStorage.getItem(constants.CURRENT_USER_KEY)),
  history:
    localStorage.getItem(constants.HISTORY_KEY) === null
      ? []
      : JSON.parse(localStorage.getItem(constants.HISTORY_KEY)), //past actions
  pastUsers:
    localStorage.getItem(constants.RECENTLY_LOGGED_USERS_KEY) === null
      ? []
      : JSON.parse(localStorage.getItem(constants.RECENTLY_LOGGED_USERS_KEY)),

  loginErrorMessage: "empty",
  showLoginError: false,
});

const actions = {
  //get user storage location ID
  async getCurrentUserStorage(state) {
    let fields = await bomist.getStorageFields(state.currentUser, true);

    state.currentUser = fields;
    return fields;
  },
  async login({ dispatch, state, rootState }, authcate) {
    //Update recently logged in list

    let loginHistory = localStorage.getItem(
      constants.RECENTLY_LOGGED_USERS_KEY
    );
    console.log("login history: ", loginHistory, null);
    let jsonData;
    if (loginHistory === null) {
      //new device
      console.log(
        "adding current user authcate when there were previously no recent users"
      );
      jsonData = JSON.stringify([authcate]);
    } else {
      jsonData = JSON.parse(loginHistory);

      console.log("JSON DATA: ", jsonData);
      let index = jsonData.indexOf(authcate);

      if (jsonData.indexOf(authcate) !== -1) {
        //authcate exists in history

        jsonData.splice(index, 1); //get rid of it before adding it back to the start
      }

      jsonData.unshift(authcate);
      console.log("added user to existing recent users");
      console.log(JSON.stringify(jsonData));

      if (jsonData.length >= constants.RECENT_HISTORY_QUANTITY) {
        jsonData.pop();
      }
    }

    //User state stuff
    let avatar = `https://avatars.dicebear.com/api/identicon/${Math.random()}.svg`;
    state.currentUser = { ...state.currentUser, avatar };
    state.pastUsers = jsonData; //Need to actually save authcae to pastUsers in state otherwise it won't be stored in local storage
    // localStorage.setItem(constants.RECENTLY_LOGGED_USERS_KEY, JSON.stringify(jsonData))
    // console.log(
    //   "is this code even running" + JSON.stringify( localStorage.getItem(constants.RECENTLY_LOGGED_USERS_KEY))
    // )
    dispatch("setLocalStorage", true, { root: true });

    router.push("/take");
    rootState.currentPath = "take"; //do we even need this?

    state.showLoginError = false;
  },
  async processLoginInput({ state, dispatch }, input) {
    //entry function after user has entered an input into login field

    event.preventDefault();
    let error = null;

    //1. Check if there is localStorage support
    if (typeof Storage === "undefined") {
      error = constants.LOCALSTORAGE_UNSUPPORTED_ERROR_MESSAGE;
    } else {
      input = input.toLowerCase();
      console.log("input: ", input);

      // console.log(dispatch("isAuthcate", input));

      //2. Check if it is a valid authcate
      if (await dispatch("isAuthcate", input)) {
        let userStorage = await bomist.getStorageFields(input, true);
        
        if (userStorage === null) {
          //error: authcate is not in system
          error = constants.UNREGISTERED_AUTHCATE_ERROR_MESSAGE;
        } else {
          state.currentUser = { ...userStorage, authcate: input };

          dispatch("login", input);
        }
      } else {
        error = constants.INVALID_AUTHCATE_ERROR_MESSAGE;
      }
    }

    if (error !== null) {
      state.loginErrorMessage = error;
      state.showLoginError = true;

      //display error message
      setTimeout(
        () => (state.showLoginError = false),
        constants.LOGIN_ERROR_SHOW_TIMEOUT
      );
    }
  },
  isAuthcate(state, string) {
    /* PURPOSE: Checks if a string typed by user is an authcate. 
            **This function is NOT compatible with old authcates: jsmi1 (nowadays= jsmi0001), jli9 (nowadays= jlii0009)
            INPUT: potential authcate (string)
            PROCESS: Checks if string comprises four letters followed by four numeric digits (no spaces)
            OUTPUT: If valid student ID card, true. Else, returns false.
            EXAMPLES: 
            isAuthcate("12345678") == false
            isAuthcate("jsmi 001") == false
            isAuthcate("jsmi0001") == true
            */

    // Remove any whitespaces (or tabs or new lines)
    string = string.replace(/\s+/g, "");

    console.log("authcate: ", string);

    // If str not of length 8, then cannot be an authcate
    if (string.length != constants.ID_AUTHCATE_LENGTH) {
      return false; // Not an authcate
    }

    // Slice str to check if first 4 characters are letters and last 4 characters are numeric digits
    let letterComponent = string.slice(0, constants.AUTHCATE_NUMERIC_LENGTH);
    let numericComponent = string.slice(
      constants.AUTHCATE_NUMERIC_LENGTH,
      constants.ID_AUTHCATE_LENGTH
    );

    // Check if letterComponent is only letters, and numeric component is not NaN (so must be a number)
    if (
      /^[a-zA-Z]+$/.test(letterComponent) &&
      !isNaN(Number(numericComponent))
    ) {
      return true; // is an authcate
    }

    return false; // false for any other case
  },
  async getAuthcateFromID({ dispatch }, studentID) {
    /* PURPOSE: Obtains authcate corresponding to the provided student ID
      INPUT: student ID (string, *NOT an integer), which has been loaded into the description of one location
      PROCESS: searches the description field of each user location and obtains the name (authcate)
      OUTPUT: If authcate exists in BOMIST for a given student ID, authcate is returned. Else, returns null.
      EXAMPLES: 
      getAuthcateFromID(12345678) == "jsmi0001"
      */

    // Obtain storage location data
    let requestString =
      constants.PROXY_SERVER + constants.BOMIST_SERVER + constants.STORAGE_PATH;

    let response = await fetch(requestString);
    let data = await response.json();
    console.log("getAuthcateFromID data is: ", data);
    // Search through data object to find authcate (name of location) corresponding to the student ID (in description field) inputted into this function

    // Compares the desired student ID to the description field of a given storage location
    // If storage location does not have description, BOMIST does not include this property in the object. Thus, need to check if it has this field first.
    const isDesiredLocation = (element) =>
      Object.prototype.hasOwnProperty.call(element.storage, "description") &&
      element.storage.description === studentID;

    // Now, look for the index location with the corresponding student ID
    let userLocationIndex = data.findIndex(isDesiredLocation);

    // Check if the code above found the student ID in the system, and then set authcate to that location's name
    if (userLocationIndex != -1) {
      // Then, obtain authcate (storage location name) from that storage location
      return data[userLocationIndex].storage.name;
    }

    return null;
  },
  async logout({ dispatch, state, rootState }) {
    dispatch("setLocalStorage", true, { root: true }); //set to true because you should NOT delete EVERYTHING in the local storage, some things you still want to persist
    //These things don't need to persist, so remove:
    let dataPersistDict = [
      "HISTORY",
      "CART",
      "ACTIVE_LOCATION",
      "LOCATIONS",
      "CURRENT_PATH",
      "RETURN_LIST",
    ];

    //DO WE NEED THIS??
    for (let i = 0; i < dataPersistDict.length; i++) {
      localStorage.removeItem(
        dataPersistDict[i].key,
        JSON.stringify(dataPersistDict[i].value)
      );
    }

    dispatch("resetStore", null, { root: true });

    router.push("/");
    console.log("Logged out");
  },
};

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};