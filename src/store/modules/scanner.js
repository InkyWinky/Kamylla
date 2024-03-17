import UIkit from "uikit";
import store from "..";
import bomist from "../../scripts/api/bomist";

import * as constants from "../../scripts/dictionary";

import { router } from "../../main";

const getDefaultState = () => {
  return {
    activeLocation: [],
    locations: [],
    partToReturn: null,
    recentScan: null,
  };
};

const state = () => ({
  activeLocation:
    localStorage.getItem("ACTIVE_LOCATION") === null
      ? []
      : JSON.parse(localStorage.getItem("ACTIVE_LOCATION")),
  locations:
    localStorage.getItem("LOCATIONS") === null
      ? []
      : JSON.parse(localStorage.getItem("LOCATIONS")),
  partToReturn: null,
  recentScan: "",
});

const getters = {
  activeLocation: (state) => {
    return state.activeLocation;
  },
  locations: (state) => {
    return state.locations; 
  },
  recentScan: (state) => {
    return state.recentScan;
  },
  partToReturn: (state) => {
    return state.partToReturn;
  },
};

const actions = {
  async changeActiveLocation({ state, dispatch, rootState }, location) {
    // PURPOSE: changes the active location for the Take page
    //input: location to change to
    //output: nothing (switches to "Current Location" tab, updates active_location)
    if (location === state.activeLocation) {
      state.activeLocation = null;
    }

    //calls checkCartChanges method in the cart.js module
    await dispatch("cart/checkCartChanges", rootState.cart.cart.length - 1, {
      root: true,
    });

    state.activeLocation = location;

    UIkit.switcher("#tab-list").show(1);
  },
  
  async processScan({ state, rootState, dispatch, commit }, scan) {
    // PURPOSE: the function to be called after user scans part/location
    // input: scanned ID
    // output:
    // store.commit(constants.ALERT_SHOW_MUTATION, false);
    //Strip barcode of $Bid or $Bsid. If it starts with $Bid, don't decode. If it starts with $Bsid, decode with base-58
    for (let i =0; i<constants.BARCODE_PREFIXES_ARRAY.length; i++){
      if (scan.startsWith(constants.BARCODE_PREFIXES_ARRAY[i])){

        scan = scan.substring(constants.BARCODE_PREFIXES_ARRAY[i].length);
        console.log(scan)

        if (i !== 0){
          const base58 = require('bs58')
          const bytes = base58.decode(scan)
          scan = bytes.toString()
          console.log("decodedScan: " + scan)
        }
        break;
      }
    }

    state.recentScan = scan;

    let currentPage = router.currentRoute.path;
    let barcodeType = await bomist.typeOfBarcode(scan);

    console.log("barcode type:", barcodeType);

    if (barcodeType === undefined){
      dispatch("processInvalidScan")
    }
    else if (currentPage === "/") {
      dispatch("processLoginScan", scan);
    } else if (barcodeType === "part") {
      dispatch("processPartScan", { scan, currentPage });
    } else if (barcodeType === "storage") {
      dispatch("processLocationScan", { scan, currentPage });
    }
   
  },

  async processInvalidScan(){
    store.commit(constants.ALERT_SHOW_MUTATION, true);
    store.commit(constants.ALERT_MSG_MUTATION, constants.INVALID_ID_MSG)
  },
  async processPartScan({ state, dispatch, rootState }, { scan, currentPage }) {
    //purpose: adds part to cart/returnList (if valid) based on page ("/take", "/return")
    //input: scan id (string), currentPage (with hyphen)
    //output: none
    console.log("ACTLOC: "+ state.activeLocation.length)

    if (currentPage === "/take" && state.activeLocation.length === 0) {
      //show error
      store.commit(constants.ALERT_SHOW_MUTATION, true);
      store.commit(constants.ALERT_MSG_MUTATION, constants.LOCATION_FIRST_MSG);
      return;
    }

    //GET part fields
    let fields = await bomist.getPartFields(scan);

    if (currentPage === "/take") {
      //Check if part exists in active_locat
      for (let i = 0; i < state.activeLocation.parts.length; i++) {
        let part = state.activeLocation.parts[i];
        if (part.id === fields.id) {
          dispatch("cart/addPartToCart", part, { root: true });
          return;
        }
      }

      //show error if part doesn't exist in active_location
      store.commit(constants.ALERT_SHOW_MUTATION, true);
      store.commit(constants.ALERT_MSG_MUTATION, constants.PART_NOT_FOUND_MSG);
      console.log(
        `Did NOT find scanned partId in the current this.active_location. Scanned partId (newScan) == ${scan}`
      );
    } else if (currentPage === "/return") {
      store.commit(constants.ICON_TAB_MUTATION, 5);
      store.commit(constants.CONFIRM_MUTATION, false); //reset confirm allowance after scanning a new return item
      let storageLocations = [];
      let partExistsInUserLocation = false;

      let locationSelected = false;

      //GET /inventory to retrieve the qty in each storage location
      let partInventories = await bomist.getInventoryFields(fields.id, true);

      for (let i = 0; i < partInventories.length; i++) {

        if (partInventories[i].storage ===""){
          continue
        }
        
        let storageFields = await bomist.getStorageFields(
          partInventories[i].storage
        );

        if (storageFields === null) {
          continue;
        }

        storageFields = {
          ...storageFields,
          qty: partInventories[i].qty,
        };

        if (storageFields.fullName.startsWith("Users")) {
          let authcate = storageFields.fullName.split("-")[1];

          if (authcate === rootState.accounts.currentUser.authcate) {
            partExistsInUserLocation = true;
          }
        }

        storageLocations.push(storageFields);
      }

      if (!partExistsInUserLocation) {
        store.commit(constants.LOADER_SHOW_MUTATION, false);
        console.log("AlreadyReturned");
        store.commit(constants.ALERT_SHOW_MUTATION, true);
        console.log("Line 311: shown Alert");
        store.commit(
          constants.ALERT_MSG_MUTATION,
          constants.PART_ALREADY_RETURNED_MSG
        );
        return constants.PART_ALREADY_RETURNED_MSG;
      }

      state.partToReturn = {
        ...fields,
        qty: 1,
        added: 0,
        locations: storageLocations,
        returnToLocation: storageLocations.filter(
          (location) => !location.fullName.startsWith("User")
        )[0]
        ,
        returnFromLocation: storageLocations.find(
          (location) =>
            location.name === rootState.accounts.currentUser.authcate
        ),
      };
    }
  },
  async processLocationScan(
    { state, commit, rootState, dispatch },
    { scan, currentPage }
  ) {
    let fields;
    if (
      (currentPage === "/return" && state.partToReturn !== null) ||
      currentPage === "/take"
    ) {
      console.log("Does the scan go through?" + scan)
      fields = await bomist.getStorageFields(scan);
      console.log("FIELDS: ", fields);
    } else {
      console.log("location scanned on wrong page");
      //Show error message
      if (currentPage === "/return") {
      store.commit(constants.ALERT_SHOW_MUTATION, true);
      store.commit(
        constants.ALERT_MSG_MUTATION,
        constants.RETURN_SCAN_PART_MSG
      );
      }
      return;
    }

    if (currentPage === "/take") {
      let takeIndex;

      if (state.locations.length > 0) {
        console.log("No. locations: ", state.locations[0]);
        takeIndex = state.locations.findIndex(
          (location) => location.id === fields.id
        );
      } else takeIndex = -1;

      if (takeIndex === -1) {
        fields = { ...fields, parts: [] };
        state.locations.push(fields);
        console.log("adding parts to location...");
        commit("addPartsToLocation", fields);
      } else {
        fields = state.locations[takeIndex];
      }

      dispatch("changeActiveLocation", fields);
    } else if (currentPage === "return") {
      console.log("state.partToReturn: "+state.partToReturn)
      if (state.partToReturn === null) {
        //show errors
        store.commit(constants.ALERT_SHOW_MUTATION, true);
        store.commit(
          constants.ALERT_MSG_MUTATION,
          constants.RETURN_SCAN_PART_MSG
        );
        console.log("must scan a part first");
        return;
      }

      let returnIndex = state.partToReturn.locations.findIndex(
        (location) => location.id === fields.id
      );

      state.partToReturn.locations = state.partToReturn.locations.map(
        (location) => {
          return {
            ...location,
            selected: false,
          };
        }
      );

      if (returnIndex === -1) {
        state.partToReturn.locations.push({ ...fields, selected: true });
      } else {
        state.partToReturn.locations[returnIndex].selected = true;
      }
    }
  },

  // showErrors({ state, store }, { mutation, msg }) {
  //   errors.forEach((error) => {
  //     store.commit(mutation, msg);
  //   });
  // },
  async processLoginScan({ dispatch, rootState }, scannedBarcode) {
    /* PURPOSE: On the login screen, user can scan student ID card to login. Need to verify a student ID card was scanned, not some other barcode. Error returned is displayed in GUI.
      INPUT: scannedBarcode (string), should be student ID card barcode
      PROCESS: checks if is a student ID card barcode, and obtains authcate if it is
      OUTPUT: If valid student ID card, returns corresponding authcate (with letters in lower case) and calls login(authcate). Else, returns an error message.
      */

    let authcate = null; // default to null
    let error = null;

    // Remove any whitespaces (or tabs or new lines)
    scannedBarcode = scannedBarcode.replace(/\s+/g, "");

    // Check if correct length for student ID/authcate
    if (scannedBarcode.length !== constants.ID_CARD_BARCODE_LENGTH) {
      console.log(
        `Barcode (${scannedBarcode}) is incorrect length. A student ID card barcode was not scanned. NOT logging in.`
      );

      error = constants.NOT_ID_CARD_BARCODE_ERROR_MESSAGE;
    }
    // Number() returns NaN when it takes in a string which does not purely contain numeric digits
    else if (!isNaN(Number(scannedBarcode))) {
      // Student ID Card Case: true when purely numerical digits and of length 8
      // console.log("scannedBarcode was purely numerical digits and of length 8: " + scannedBarcode);

      // Obtain authcate from student ID
      let studentID = scannedBarcode.slice(0, constants.ID_AUTHCATE_LENGTH); // first 8 digits is student ID
      authcate = await dispatch("accounts/getAuthcateFromID", studentID, {
        root: true,
      }); // wait for authcate to be returned

      // Check that an authcate was found from student ID in the BOMIST system
      if (authcate !== null) {
        // After obtaining login from valid student ID barcode scan, now login
        console.log(
          `Found authcate of ${authcate} from scannedBarcode ${scannedBarcode} successfully. Logging in now.`
        );
        await dispatch("accounts/login", authcate, { root: true });
      } else {
        // Else, student ID not in BOMIST
        console.log(
          `Barcode scanned (${scannedBarcode}) was NOT found in BOMIST. NOT logging in.`
        );

        error = constants.UNREGISTERED_ID_CARD_ERROR_MESSAGE;
      }
    }

    if (error !== null) {
      rootState.state.accounts.state.showLoginError = true;
      rootState.state.accounts.state.loginErrorMessage = error;
    }
  },
};

const mutations = {
  //PURPOSE: call API to add all parts @ location to list
  //input: location object
  //output: sets location.parts array
  async addPartsToLocation(state, location) {
    //only add parts to locations.parts list if the list is empty
    store.commit(constants.LOADER_SHOW_MUTATION, true);

    if (location.parts.length > 0) return;

    let index = state.locations.findIndex(
      (_location) => location.id === _location.id
    ); //location id wouldn't have changed as API would have just been called

    console.log("LOCATION: ", location);
    let inventories = await bomist.getInventoryFields(location.id, false);
    console.log("inventories: ", inventories);
    let parts = [];

    for (let i = 0; i < inventories.length; i++) {
      let partFields = await bomist.getPartFields(inventories[i].part);
      console.log("part fields: ", partFields);
      parts.push(partFields);
    }

    state.locations[index].parts = parts;

    console.log("PARTS: ", parts);

    store.commit(constants.LOADER_SHOW_MUTATION, false);
  },
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};