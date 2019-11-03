"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Board = _interopRequireDefault(require("./Game/Board"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game =
/*#__PURE__*/
function () {
  function Game(player1, player2) {
    _classCallCheck(this, Game);

    this.room = player1.id;
    this.hand = player1.id;
    this.players = [player1, player2];
    this.initPawnsId();
    this.board = new _Board["default"]();
    this.status = 1; // 1: onGame || 0: endGame
  }

  _createClass(Game, [{
    key: "playersOnGame",
    value: function playersOnGame() {
      this.players[0].status = 2;
      this.players[1].status = 2;
    }
  }, {
    key: "initPawnsId",
    value: function initPawnsId() {
      // 1 => black pawns
      // 2 => white pawns
      this.players[0].boardPawnsId = 1;
      this.players[1].boardPawnsId = 2;
    }
  }, {
    key: "currentPlayer",
    value: function currentPlayer() {
      var _this = this;

      return this.players.filter(function (player) {
        return player.id === _this.hand;
      })[0];
    }
  }]);

  return Game;
}();

var _default = Game;
exports["default"] = _default;