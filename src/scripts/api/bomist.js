import * as constants from "../dictionary";

export default {
  async getData(url) {
    /* PURPOSE: function for all api GET calls
    INPUT: http request url
    PROCESS: 
    OUTPUT: response object
    EXAMPLES: 
    */
    console.log("getting data...");
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
    });
    var data = await response.json();
    //testing console log functions
    console.log("data response: " + JSON.stringify(data));
    console.log("url used: " + url);
    return data;
  },

  async postData(url, data = {}) {
    /* PURPOSE: function for all api POST calls
    INPUT: http request url
    PROCESS: 
    OUTPUT: none
    EXAMPLES: 
    */
    console.log(JSON.stringify(data));

    let response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(response);

    // response = await response.json();

    // console.log("RESPONSE: ", response);

    // return response;
  },
  async getInventoryFields(id, isPart = false, checkIsUser = false) {
    console.log("getting inventory fields>..");
    let URL;
    let isUser = false;
    if (isPart) {
      URL =
        constants.ENDPOINT +
        constants.ITEM_PATH +
        "/" +
        id +
        constants.INVENTORY_PATH;
    } else {
      URL =
        constants.ENDPOINT +
        constants.LOCATION_PATH +
        "/" +
        id +
        constants.INVENTORY_PATH +
        "?nested=false"; 
    }
    if (checkIsUser){ //Check if storage id corresponds to user
      let storageURL =
      constants.ENDPOINT +
      constants.LOCATION_PATH +
      "/" +
      id;
      let storageObj = await this.getData(storageURL)
        if (storageObj.storage.fullName.startsWith(constants.USER_PREFIX)){
          isUser = true;
        }
      }

    let fields = await this.getData(URL);//fields is inventory return object (stop calling every, single, object, fields.)
    fields = fields.map((field) => ({ //An array of custom objects
      inventoryId: field.inventory.id,
      qty: field.inventory.qty,
      storage: field.inventory.storage,
      part:
        typeof field.inventory.part === "undefined"
          ? null
          : field.inventory.part, //if someone can find a way to omit the "part" attribute if typeof === "undefined" that'd be great thanks
      isUser: isUser
        }));
    console.log("TYP:"+JSON.stringify(fields))
    return fields;
  },
  async getStorageFields(id, authcate = false) {
    console.log("getStorageFields id Parameter used: " + id);
    console.log(id === "");
    let URL = constants.ENDPOINT + constants.LOCATION_PATH + "/" + id;

    if (authcate) {
      URL = constants.ENDPOINT + constants.LOCATION_PATH;
      // +
      // "?fullNameSeparator=" +
      // constants.FULL_NAME_SEPARATOR;
    }

    let fields = await this.getData(URL); //fields is storage return object (fields is a very vague name can we change it)
    if (authcate) {
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].storage.name === id) {
          fields = fields[i];
          break;
        }
      }
    }
    // else {
    //   fields = fields[0]; //fields is just an array of an object (length = 1)
    // }

    try {
      return {
        id: fields.storage.id,
        description: fields.storage.description,
        fullName: fields.storage.fullName,
        name: fields.storage.name,
      };
    } catch {
      return null; //storage is either 'unallocated' or empty
    }
  },

  async getPartFields(id) {
    let URL = constants.ENDPOINT + constants.ITEM_PATH + "/" + id;

    let fields = await this.getData(URL);
    let label = null;
    let thumbnail = "null.png";


    if (fields.part.label !== "") {
      //Call API to retrieve label name from label 
      label = await this.getData(
        constants.ENDPOINT + constants.LABELS_PATH + "/" + fields.part.label
      );

      let labelFull = label.fullName;
      // Split into all labels in order to get the leaf label
      let labelArray = labelFull.split(" - ")
      label = labelArray.slice(-1)[0]
    }

    if (typeof fields.part.thumbnail !== "undefined") {
      let thumbnailArray = await this.getData(
        constants.ENDPOINT +
          constants.DOCUMENTS_PATH +
          "/" +
          fields.part.thumbnail
      );

      thumbnail = thumbnailArray[0].document.name;
    }

    return {
      id,
      asset: fields.part.type === constants.ASSET_PROPERTY_NAME ? true : false,
      consumable:
        typeof fields.part[constants.CONSUMABLE_PROPERTY_NAME] === "undefined"
          ? false
          : fields.part[constants.CONSUMABLE_PROPERTY_NAME],
      condition:
        typeof fields.part[constants.CONDITION_PROPERTY_NAME] === "undefined"
          ? null
          : fields.part[constants.CONDITION_PROPERTY_NAME],
      description: fields.part.description,
      label,
      thumbnail,
      mpn: fields.part.mpn,
      ipn: fields.part.ipn,
      stock: fields.part.stock,
      storage: fields.part.storage, //array of ids
    };
  },

  async typeOfBarcode(scannedBarcode) {
    /* PURPOSE: 
    INPUT: location id (string)
    OUTPUT: "storage", "part", null
    */

    console.log("barcode: ", scannedBarcode);

    try {
      let storageObj = await this.getData(
        constants.ENDPOINT + constants.LOCATION_PATH + "/" + scannedBarcode

        // + "?fullNameSeparator=" +
        // constants.FULL_NAME_SEPARATOR
      );
      if (scannedBarcode.startsWith("st_")) {
        return "storage";
      }
      if (scannedBarcode.startsWith("pa_")) {
        return "part";
      }
    } catch {
      return null;
    }
  },
  async adjustQty(part, storage, qtyToAdd) {
    //inputs: storage object, part object, quantity
    let storageInventoryFields = await this.getInventoryFields(storage.id);
    let partInventoryFields = await this.getInventoryFields(part.id, true);
    let inventory = null;
console.log("length: " + partInventoryFields.length)
main: for (let i = 0; i < partInventoryFields.length; i++) {
      console.log("searching for common inventory:")
      for (let j = 0; j < storageInventoryFields.length; j++) {
        console.log(partInventoryFields[i].inventoryId + " = " + storageInventoryFields[j].inventoryId + "?" )
        if (partInventoryFields[i].inventoryId === storageInventoryFields[j].inventoryId) {
          inventory = storageInventoryFields[j];
          break main;
        }
      }
    }

    if (inventory === null) {
      console.log("item does not exist at location");
      return;
    }
    let URL =
      constants.ENDPOINT +
      constants.INVENTORY_PATH +
      "/" +
      inventory.inventoryId +
      constants.ADJ_QTY_PATH;

    let data = { qty: qtyToAdd };

    console.log("DATA: ", data);

    await this.postData(URL, data);
  },

  async moveQty(part, storageFrom, storageTo, qtyToMove) {
    /* PURPOSE: moves a quantity of items into user location
    INPUT: part ID (string), storageId (string),  storageId, qtyToMove (+ve number)
    PROCESS: 
    OUTPUT: None
    EXAMPLES: see function takeBtn
    */

    let storageInventoryFields = await this.getInventoryFields(storageFrom.id, false, true);
    let partInventoryFields = await this.getInventoryFields(part.id, true);
    let inventory = null;
    let zeroInventory = false;
    main: for (let i = 0; i < partInventoryFields.length; i++) {
      // console.log("why doesn't this work"+ partInventoryFields.length + storageInventoryFields.length)
      for (let j = 0; j < storageInventoryFields.length; j++) {
        // console.log("why doesn't this work"+ storageInventoryFields.length)
        // console.log(partInventoryFields[i].inventoryId + " = " + storageInventoryFields[j].inventoryId + "?" )
        if (partInventoryFields[i].inventoryId === storageInventoryFields[j].inventoryId) {
          inventory = storageInventoryFields[j];
          break main;
        }
      }
    }
    if (inventory === null) {
      console.log("part does not exist in storage location to take from");
      return;
    }

    let URL =
      constants.ENDPOINT +
      constants.INVENTORY_PATH +
      "/" +
      inventory.inventoryId+
      constants.MOVE_QTY_PATH;

    let adjUrl =
      constants.ENDPOINT +
      constants.INVENTORY_PATH +
      "/" +
      inventory.inventoryId +
      constants.ADJ_QTY_PATH;

    //Check if qty moved will cause 0 qty in inventory, if so prevent it from happening
    //Will this cause
    console.log("QTY_TO_MOVE = " + qtyToMove)
    console.log("INVENTORYQTY = "+ inventory.qty)
      if (qtyToMove - inventory.qty === 0) {
        console.log("IT EQUALS 0")
        if (!storageInventoryFields.isUser){
          console.log("IT is not moving from a user storage")
          let addData = { qty: 1 };
          await this.postData(adjUrl, addData); //Add 1 to the inventory moving FROM
          zeroInventory = true;
        }
    }
    // Make move quantity API call
    let data = {
      qty: qtyToMove,
      toStorageId: storageTo.id,
    };
    console.log(data);

    await this.postData(URL, data);

    if (zeroInventory) {
      //Subtract 1 from the inventory
      let subData = { qty: -1 };
      await this.postData(adjUrl, subData);
    }
  },
  async returnTaken(part, toStorage, fromStorage, qtyTaken) {
    /* PURPOSE: Returns a quantity of any consumable or non-consumable item to storage. Assumes qtyTaken (qtyTaken <= total qty available in user location of that part) 
    INPUT: part ID of part to move from a user location (string), storage ID of location to move to (string), number of parts to return to that storage ID (integer)
    PROCESS: If part is consumable, then adjust_qty(). Else, since part is non-consumable, move the item from user location back to storage location.
    OUTPUT: Always returns qtyTaken.
    */

    console.log("storage id to return to: ", toStorage);

    if (part.consumable) {
      // To return consumable, increase quantity in original storage storage (+ve quantity)
      this.adjustQty(part, toStorage, qtyTaken);
    } else {
      // Part is NON-CONSUMABLE
      await this.moveQty(part, fromStorage, toStorage, qtyTaken);

      return qtyTaken; //e.g. here
    }
  },
};