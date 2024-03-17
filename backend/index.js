//load cors forwarder
// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || "0.0.0.0";
// Listen on a specific port via the PORT environment variable
// listening on 4000 for api requests
var port = process.env.PORT || 4000;

var cors_proxy = require("cors-anywhere");

var finalhandler = require("finalhandler");
var http = require("http");
var serveStatic = require("serve-static");
var open = require("open");
const { exec } = require("child_process");

cors_proxy
  .createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"],
  })
  .listen(port, host, function () {
    console.log("Running CORS Anywhere on " + host + ":" + port);
  });

//HTTP Server
var serve = serveStatic("scanner_page", {
  index: ["scanner.html"],
});

// Create server
var server = http.createServer(function onRequest(req, res) {
  serve(req, res, finalhandler(req, res));
});

// Listen
server.listen(4500, "0.0.0.0");

open("http://localhost:4500");

//Serve Kamylla
 //Build kamylla
 exec("cd ../ & npm run build", (error, stdout, stderr) => {
   if (error) {
     console.log(`error: ${error.message}`);
     return;
   }
   if (stderr) {
     console.log(`stderr: ${stderr}`);
     return;
   }
   console.log(`stdout: ${stdout}`);
 });
//HTTP Server
var serveK = serveStatic("../dist", {
  index: ["index.html"],
});

// Create server
var serverK = http.createServer(function onRequest(req, res) {
  serveK(req, res, finalhandler(req, res));
});

// Listen
serverK.listen(801, "0.0.0.0");

//Websocket forwarder
const WebSocket = require("ws");
//WS scanner port is 5000, clients is 5010
const wsScannerServer = new WebSocket.Server({
  port: 5000,
  host: "0.0.0.0",
});
const wsClientServer = new WebSocket.Server({
  port: 5010,
  host: "0.0.0.0",
});

wsScannerServer.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(message);
    wsClientServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

wsClientServer.on("connection", (ws) => {
  ws.on("message", (message) => {});
  console.log("New client connected");
});
