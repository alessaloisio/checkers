"use strict";

var _socket = _interopRequireDefault(require("socket.io"));

var _Player = _interopRequireDefault(require("./models/Player"));

var _RoomManager = _interopRequireDefault(require("./models/RoomManager"));

var _SelectionLogic = _interopRequireDefault(require("./models/Game/SelectionLogic"));

var _EndGame = _interopRequireDefault(require("./models/Game/EndGame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var io = (0, _socket["default"])();
var players = [];
var games = [];
io.on("connection", function (client) {
  var self = {
    io: io,
    client: client,
    games: games
  }; // TIPS to know if a player is ready (putting the value to false)
  // after player ready to play we edit the value to true and we are
  // can now search a opponent with already a true value

  io.of("/").adapter.rooms[client.id].sockets[client.id] = false;
  var player = new _Player["default"](client.id);
  players.push(player);
  player.encodeToken();
  client.emit("playerInfo", player.token);
  /**
   * Change Player Name
   */

  client.on("changeName", function (username) {
    player.name = username;
    player.encodeToken();
    client.emit("playerInfo", player.token);
  });
  /**
   * Player ready to search opponent and start the game
   */

  client.on("playBtn", function () {
    console.log("".concat(player.name, " want to play !"));
    (0, _RoomManager["default"])({
      self: self,
      players: players,
      player: player
    });
    /**
     * Player selected a box
     */

    client.on("selectedBox", function (boxId) {
      games = (0, _SelectionLogic["default"])({
        self: self,
        boxId: boxId
      });
    });
    /**
     * Player want to give up
     */

    client.on("playerGiveUp", function () {
      games = (0, _EndGame["default"])({
        self: self
      });
    });
  });
  /**
   * Disconnected
   */

  client.on("disconnect", function () {
    console.log("Client ".concat(player.name, " disconnected"));
    var newGames = (0, _EndGame["default"])({
      self: self
    });
    if (newGames) games = newGames;
    console.log("last", games); // Remove Player from players Array

    players = players.filter(function (player) {
      return player.id !== client.id;
    });
  });
}); // START SERVER

var port = process.env.port || 5005;
io.listen(port);
console.log("Socket.io listening on port ".concat(port));