const LS_WEBSERVER_KEY = "LS_WEBSERVER";
const DEBUG_ON = true;
let webserverSocket = null;
let websocket = null;
let wsStatus = document.getElementById("websocket-status");
let wsStatus2 = document.getElementById("websocket-status2");
let debugInput = document.getElementById("debug-scanner");

let scannerCurrentString = "";
let scannerHasStarted = true;

initWebserverAddress();
document.addEventListener("keypress", sendScannerData);

function sendScannerData(event) {
  if (event.key === "Enter") {
    if (DEBUG_ON && debugInput.value !== "") {
      scannerCurrentString = debugInput.value;
      debugInput.value = "";
    }
    websocket.send(scannerCurrentString);
    scannerCurrentString = "";
  } else {
    scannerCurrentString += event.key;
  }
}

function initWebserverAddress(newAddress = false) {
  //Set default localstorage value
  if (localStorage.getItem(LS_WEBSERVER_KEY) === null) {
    localStorage.setItem(LS_WEBSERVER_KEY, "localhost:5000");
  }
  //If a new address save, otherwise retrieve
  if (newAddress) {
    webserverSocket = document.getElementById("server").value;
    localStorage.setItem(LS_WEBSERVER_KEY, webserverSocket);
  } else {
    webserverSocket = localStorage.getItem(LS_WEBSERVER_KEY);
    document.getElementById("server").value = webserverSocket;
  }

  //Setup the websocket
  initWebsocket();
}

function initWebsocket() {
  //Close old socket
  if (websocket !== null) {
    websocket.close();
  }

  websocket = new WebSocket("ws://" + webserverSocket);
  wsStatus.innerText = "Connecting...";
  wsStatus2.innerText = "Connecting...";

  websocket.onerror = (event) => {
    console.log(event);
    wsStatus.innerText = "There was an error, please check the console";
    wsStatus2.innerText = "There was an error, please check the console";
  };
  websocket.onopen = () => {
    wsStatus.innerText = "Connected";
    wsStatus2.innerText = "Connected";
    wsStatus2.style.color = "rgba(180, 252, 162, 0.973)";
  };
}

function changeAddress() {
  let changeButton = document.getElementById("change-button");
  let addressInput = document.getElementById("server");
  //Undisable if disabled
  if (addressInput.disabled) {
    addressInput.disabled = false;
    changeButton.innerText = "Set";
  } else {
    //Set new address
    initWebserverAddress(true);
    addressInput.disabled = true;
    changeButton.innerText = "Change";
  }
}
function unloadFunction() {
  return "";
}
function setToScan(textId) {
  let textToCopy = document.getElementById(textId).innerHTML;
  document.getElementById("debug-scanner").value = textToCopy;
}

function switchPages() {
  let testPage = document.getElementById("testPage");
  let mainPage = document.getElementById("mainPage");
  if (testPage.style.display === "none") {
    testPage.style.display = "block";
    mainPage.style.display = "none";
  } else {
    testPage.style.display = "none";
    mainPage.style.display = "block";
  }
}
