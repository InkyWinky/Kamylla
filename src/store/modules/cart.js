import store from "..";
import bomist from "../../scripts/api/bomist";
import * as constants from "../../scripts/dictionary";

const getDefaultState = () => {
  return {
    cart: [],
    returnList: [],
  };
};

const state = () => ({
  cart:
    localStorage.getItem(constants.CART_KEY) === null
      ? []
      : JSON.parse(localStorage.getItem(constants.CART_KEY)), //cart list
  returnList:
    localStorage.getItem(constants.RETURN_LIST_KEY) === null
      ? []
      : JSON.parse(localStorage.getItem(constants.RETURN_LIST_KEY)), //() => {
});

const getters = {
  cart: (state, getters, rootState) => {
    return state.cart;
  },
  returnList: (state) => {
    return state.returnList;
  },
};

const actions = {
  //PURPOSE: adds a specific item to cart
  //input: item object
  //output: depending on whether item already exists in cart, and if it even exists at active_location, alter the cart list
  addPartToCart({ state, commit, dispatch, rootState }, part) {
    //get the index of the part inside the cart; index = -1 if part doesn't yet exist in the cart
    let index = state.cart.findIndex((_part) => _part.id === part.id);

    if (index === -1) {
      if (part !== null) {
        //calls the mutation (scroll down)
        let location = rootState.scanner.activeLocation;
        commit("pushPartToCart", { part, location });
      }
      if (state.cart.length > 1) {
        //maxIndex arg excludes the last part added to the cart
        dispatch("checkCartChanges", state.cart.length - 2);
      }
    } else {
      //adding an already existing part is effectively just changing quantity
      //therefore no api call needed
      commit("incrementPartQuantity", part);
    }
  },
  addPartToReturnList({ state, rootState, dispatch }) {
    let partToReturn = rootState.scanner.partToReturn;

    // let selectedLocation = partToReturn.locations.find(
    //   (location) => location.selected === true
    // );

    let index = state.returnList.findIndex(
      (part) =>
        part.id === partToReturn.id &&
        part.returnToLocation.id === partToReturn.returnToLocation.id &&
        part.returnFromLocation.id === partToReturn.returnFromLocation.id
    );

    if (index === -1) {
      state.returnList.push(partToReturn);
    } else {
      console.log("exists already");

      state.returnList[index].qty += partToReturn.qty;
    }

    if (state.returnList.length > 1) {
      dispatch("checkReturnListChanges", state.returnList.length - 2);
    }
    rootState.scanner.partToReturn = null;
    store.commit(constants.ICON_TAB_MUTATION, 4);
  },
  //PURPOSE: to loop through the cart, checking for changes to then call these changes to be added to BOMIST system
  //input: maxIndex - the max. index to loop through array (e.g. might not want to add last part in cart)

  async checkCartChanges({ state, dispatch, rootState }, maxIndex) {
    for (let i = 0; i <= maxIndex; i++) {
      //check if the quantity of a part has been increased but not yet added to BOMIST system
      if (state.cart[i].quantity > state.cart[i].added) {
        console.log("moving part");
        await bomist.moveQty(
          state.cart[i],
          state.cart[i].location,
          rootState.accounts.currentUser,
          state.cart[i].quantity - state.cart[i].added
        );

        if (state.cart[i].consumable) {
          console.log("CONSUMABLE PART DETECTED");
          console.log("adjusting part");
          //remove consumable from the user's storage location
          bomist.adjustQty(
            state.cart[i], //part
            rootState.accounts.currentUser,
            -(state.cart[i].quantity - state.cart[i].added) //negative to decrease quantity
          );
        }

        //if part quantity has been decreased and change not yet called to the API
      } else if (state.cart[i].quantity < state.cart[i].added) {
        bomist.returnTaken(
          state.cart[i],
          state.cart[i].location,
          rootState.accounts.currentUser,
          state.cart[i].added - state.cart[i].quantity
        );
      }

      //set the part's added property to be equal to the quantity displayed in the cart (after the API calls ^)
      state.cart[i].added = state.cart[i].quantity;
    }
  },
  //PURPOSE: pretty much same as checkCartChanges
  checkReturnListChanges({ state, rootState }, maxIndex) {
    for (let i = 0; i <= maxIndex; i++) {
      console.log(state.returnList[i]);
      let quantityToReturn =
        state.returnList[i].qty - state.returnList[i].added;

      if (quantityToReturn !== 0) {
        bomist.returnTaken(
          state.returnList[i],
          state.returnList[i].returnToLocation,
          state.returnList[i].returnFromLocation,
          quantityToReturn
        );
      }

      //set the part's added property to be equal to the quantity displayed in the cart (after the API calls ^)
      state.returnList[i].added = state.returnList[i].qty;
    }
  },
  deletePart({ state, rootState }, part) {
    //first check if part has actually been added to the BOMIST system

    if (part.added > 0) {
      bomist.returnTaken(
        part,
        part.location,
        rootState.accounts.currentUser,
        part.added
      );
    }
    //filter the cart by removing that part ^
    state.cart = state.cart.filter(
      (_part) => _part.id !== part.id || _part.location.id !== part.location.id
    );
  },
  //PURPOSE: when user presses the 'undo' button for an part that has been returned in Return.vue
  //input: part object
  undoReturn({ state, rootState }, part) {
    if (part.added > 0) {
      bomist.moveQty(
        part,
        part.returnToLocation,
        part.returnFromLocation,
        part.added
      );
    }

    state.returnList = state.returnList.filter(
      (_part) =>
        _part.id !== part.id &&
        _part.returnFromLocation.id !== part.returnFromLocation.id &&
        _part.returnToLocation.id !== part.returnToLocation.id
    );
  },
};

const mutations = {
  //PURPOSE: self explanatory
  incrementPartQuantity(state, { id }) {
    const partInCart = state.cart.find((part) => part.id === id);
    partInCart.quantity++;
  },
  //PURPOSE: self explanatory
  pushPartToCart(state, { part, location }) {
    //part.added: the amount that has been added to the bomist system
    //part.quantity: the amount displayed in the cart
    state.cart.push({
      ...part,
      location,
      quantity: 1,
      added: 0,
    });
  },
  resetState(state) {
    //Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState());
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};