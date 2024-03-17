function setToScan(textId) {
    let textToCopy = document.getElementById(textId).innerHTML;
    document.getElementById("debug-scanner").value = textToCopy;
  }
