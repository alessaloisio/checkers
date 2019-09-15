"use strict";

var _socket = _interopRequireDefault(require("socket.io"));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var io = (0, _socket["default"])();
var clients = [];
var rooms = [];
io.on("connection", function (client) {
  // New connection
  client.on("subscribe", function (username) {
    console.log("client ".concat(username, " is subsribing"));
    _this.username = username;
    client.emit("subscribed", {
      name: username,
      score: 0
    });
  }); // Disconnected

  client.on("disconnect", function () {
    console.log("Client ".concat(_this.username, " disconnected"));
  });
}); // START SERVER

var port = process.env.port || 5005;
io.listen(port);
console.log("Socket.io listening on port ".concat(port));