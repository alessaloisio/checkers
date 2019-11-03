"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SelectedBox =
/*#__PURE__*/
function () {
  function SelectedBox(props) {
    _classCallCheck(this, SelectedBox);

    var boxId = props.boxId,
        player = props.player,
        game = props.game;
    this.playerId = player.id;
    this.boxId = boxId;
    this.verification = this.playerVerification(player, game);
    this.typePawns = this.initTypePawns(game);
    this.typePawnsId = game.board.grid[this.boxId - 1];
  }

  _createClass(SelectedBox, [{
    key: "playerVerification",
    value: function playerVerification(player, game) {
      if (player.boardPawnsId < 2) this.boxId = 51 - this.boxId;
      var value = false;

      if (this.playerId === game.hand) {
        // need transform to str for "1a|2a" => queen pawns
        if (game.board.grid[this.boxId - 1] === 0 || ("" + game.board.grid[this.boxId - 1])[0] == player.boardPawnsId) {
          value = true;
        }
      }

      return value;
    }
  }, {
    key: "initTypePawns",
    value: function initTypePawns(game) {
      var value; // "normal" or "queen" or "empty"

      switch (game.board.grid[this.boxId - 1]) {
        case 0:
          value = "empty";
          break;

        case 1:
        case 2:
          value = "normal";
          break;

        case "1a":
        case "2a":
          value = "queen";
          break;
      }

      return value;
    }
  }]);

  return SelectedBox;
}();

var _default = SelectedBox;
exports["default"] = _default;