// ----------- API CALL STRINGS -----------

export const PROXY_SERVER = "http://kamylla.uas:4000/"; //UAS ip
//export const PROXY_SERVER = "http://localhost:4000/"; //testing ip
export const BOMIST_SERVER = "http://localhost:3333"; //ip
// export const PROXY_SERVER = "http://192.168.0.165:4000/";//Dylan's ip
export const WEB_SOCKET_SERVER = "ws://kamylla.uas:5010"; //UAS ip
// export const WEB_SOCKET_SERVER = "ws://localhost:5010"; //testing ip
// export const WEB_SOCKET_SERVER = "ws://192.168.0.165:5010";//Dylan's ip
export const ENDPOINT = PROXY_SERVER + BOMIST_SERVER;
export const ITEM_PATH = "/parts";
export const PARTS_PATH = "/parts";
export const PATHS_PATH = "/parts";
export const INVENTORY_PATH = "/inventory";
export const STORAGE_PATH = "/storage?fullNameSeparator=-";
export const LABELS_PATH = "/labels";
export const DOCUMENTS_PATH = "/documents";
export const SEARCH_PATH = "/search";
export const ADJ_QTY_PATH = "/adjust_qty";
export const MOVE_QTY_PATH = "/move_qty";
export const LOCATION_PATH = "/storage";
export const FULL_NAME_SEPARATOR = "-";
export const HISTORY_PATH = "/_history";
export const TAKE_QTY_FIELD = "take-qty";
export const TAKE_LOCATION_FIELD = "take-location";
export const TAKE_ITEM_ID_FIELD = "take-item-id";

export const CONSUMABLE_PROPERTY_NAME = "_consumable";
export const CONDITION_PROPERTY_NAME = "_condition";
export const ASSET_PROPERTY_NAME = "asset";

// ---------- LOGIN GLOBAL VARIABLES ----------
export const CURRENT_USER_KEY = "LOGGED_IN_AUTHCATE"; // local storage key of where currently logged in authcate is stored
export const CART_KEY = "CART";
export const RECENTLY_LOGGED_USERS_KEY = "RECENTLY_LOGGED_IN";// local storage key of the most recent logins stored as authcates
export const HISTORY_KEY = "HISTORY"; // state history
export const RECENT_HISTORY_QUANTITY = 10; // number of recently logged in authcates to remember
export const RETURN_LIST_KEY = "RETURN_LIST";
export const ACTIVE_LOCATION_KEY = "ACTIVE_LOCATION";
export const LOCATIONS_KEY = "LOCATIONS";
export const CURRENT_PATH_KEY = "CURRENT_PATH";
export const INVENTORY_ID_KEY = "INVENTORY_ID_CACHE";

export const ID_AUTHCATE_LENGTH = 8; // number of characters in a student ID or authcate
export const AUTHCATE_NUMERIC_LENGTH = 4; // number of numeric digits in an authcate
export const ID_CARD_BARCODE_LENGTH = ID_AUTHCATE_LENGTH + 2; // ID card barcode has 10 characters, with the last two digits being the issue number

export const USERS_LOCATION_HEADING = "Users"; // the name of the overarching "location" which contains all the user locations (authcates)

// ^These global vars may be particularly useful in other JS files besides login_logout.js
// Global vars that seem more useful only to login_logout.js are stored inside login_logout.js

//Loader constant
export const LOADER_SHOW_MUTATION = "[mutation] show loading spinner";
export const ALERT_SHOW_MUTATION = "[mutation] show alert";
export const ALERT_MSG_MUTATION = "[mutation] change alert message";
export const ICON_TAB_MUTATION = "[mutation] change tab state";
//Alert messages
export const API_DISCONNECTED_MSG = "BOMIST API is disconnected."
export const LOCATION_FIRST_MSG = "Please scan a location before an item.";
export const INVALID_ID_MSG =
  "The barcode you have scanned is invalid, please scan a different barcode.";
export const PART_NOT_FOUND_MSG =
  "Item is not found in this active location, please change active location or scan another item.";
export const SCAN_PART_MSG = "Please scan an item ID.";
export const WEB_SOCKET_CLOSE_MSG = "Server connection closed"; //Didn't want to be too specific as "Web socket connection closed"
export const RETURN_SCAN_PART_MSG = "Please scan an item ID.";
export const PART_ALREADY_RETURNED_MSG =
  "Item has not been taken yet or has already been returned.";
export const CONFIRM_MUTATION = "[mutation] change confirm state";

//Login
export const NOT_ID_CARD_BARCODE_ERROR_MESSAGE =
  "Please scan a student ID card barcode or enter your authcate to login.";
export const UNREGISTERED_ID_CARD_ERROR_MESSAGE =
  "Please scan a student ID card of a registered user in BOMIST, or enter your authcate instead.";
export const LOCALSTORAGE_UNSUPPORTED_ERROR_MESSAGE =
  "Please ensure local storage is available on your browser. If you need further help, please contact the Monash UAS Inventory Manager.";
export const UNREGISTERED_AUTHCATE_ERROR_MESSAGE =
  "Please enter a valid authcate registered in BOMIST.";
export const INVALID_AUTHCATE_ERROR_MESSAGE = "Please enter an authcate.";
export const LOGIN_ERROR_SHOW_TIMEOUT = 600000;

//Scanner 
export const BARCODE_PREFIXES_ARRAY = ["$Bid", "$Bsid"]
export const USER_PREFIX = "User"
