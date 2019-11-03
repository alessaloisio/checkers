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
    // console.log(`${player.name} want to play !`);
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
    /**
     * Leave Player2 from room
     */

    client.on("leaveRoom", function (room) {
      var rooms = io.of("/").adapter.rooms;
      if (rooms[room]) client.leave(room);
      client.join(client.id);
      io.of("/").adapter.rooms[client.id].sockets[client.id] = false;
    });
  });
  /**
   * Disconnected
   */

  client.on("disconnect", function () {
    // console.log(`Client ${player.name} disconnected`);
    // console.log("BEFORE ALL", io.of("/").adapter.rooms);
    var newGames = (0, _EndGame["default"])({
      self: self
    });
    if (newGames) games = newGames; // Remove Player from players Array

    players = players.filter(function (player) {
      return player.id !== client.id;
    }); // console.log(io.of("/").adapter.rooms);

    delete io.of("/").adapter.rooms[client.id]; // console.log(io.of("/").adapter.rooms);
  });
}); // START SERVER

var port = process.env.port || 5005;
io.listen(port);
console.log("Socket.io listening on port ".concat(port));