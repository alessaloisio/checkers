"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Game = _interopRequireDefault(require("./Game"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Room = function Room(props) {
  var _props$self = props.self,
      io = _props$self.io,
      client = _props$self.client,
      games = _props$self.games;
  var players = props.players,
      player = props.player; // FIRST CLIENT CREATE GAME IN A ROOM,
  // SECOND CLIENT JOIN THE GAME
  // DETECT AVAILABLE ROOMS for 2vs2

  var rooms = io.of("/").adapter.rooms;

  if (typeof rooms[client.id] !== "undefined") {
    player.status = 1;
    player.encodeToken();
    client.emit("playerInfo", player.token);
    rooms[client.id].sockets[client.id] = true;
    Object.keys(rooms).map(function (room) {
      // We detect a room available with a opponent ready to play
      if (room !== player.id && rooms[room].length <= 1 && rooms[room].sockets[room]) {
        // Get the available id room
        var availableRoom = Object.keys(rooms[room].sockets)[0];
        client.leave(client.id);
        client.join(availableRoom);
        player.room = availableRoom; // First player1 who create the room

        var game = new _Game["default"](players.filter(function (client) {
          return client.id === availableRoom;
        })[0], player); // SEND TO ALL PLAYER IN THE ROOM

        io.to(game.room).emit("playerJoined", // Send player1 room owner and the player2
        game);
        game.playersOnGame(); // List the game

        games.push(game);
        return game;
      }
    });
  }

  return;
};

var _default = Room;
exports["default"] = _default;