"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _getPlayerGame3 = _interopRequireDefault(require("./getPlayerGame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var EndGame = function EndGame(props) {
  var _props$self = props.self,
      io = _props$self.io,
      client = _props$self.client;
  var games = props.self.games;
  var winner = props.winner;

  var _getPlayerGame = (0, _getPlayerGame3["default"])(games, client.id),
      _getPlayerGame2 = _slicedToArray(_getPlayerGame, 2),
      player = _getPlayerGame2[0],
      game = _getPlayerGame2[1];

  if (game && game.status) {
    game.status = 0;
    game.board.grid = [];
    if (typeof winner === "undefined") game.winnerId = game.players.filter(function (p) {
      return p.id !== player.id;
    })[0].id;else game.winnerId = winner.id;
    console.log(game);
    io.to(game.room).emit("updateGame", game); // Remove the opponent of the room

    var rooms = io.of("/").adapter.rooms;

    for (var key in rooms[game.room].sockets) {
      if (rooms[game.room].sockets.hasOwnProperty(key)) {
        rooms[game.room].sockets[key] = false;
      }
    } // Remove Game from games Array


    return games.filter(function (g) {
      return g.room !== game.room;
    });
  }

  return null;
};

var _default = EndGame;
exports["default"] = _default;