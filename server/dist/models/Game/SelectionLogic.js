"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _SelectedBox = _interopRequireDefault(require("./SelectedBox"));

var _getPlayerGame3 = _interopRequireDefault(require("./getPlayerGame"));

var _EndGame = _interopRequireDefault(require("./EndGame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Logic = function Logic(props) {
  var _props$self = props.self,
      io = _props$self.io,
      client = _props$self.client;
  var boxId = props.boxId;
  var games = props.self.games;

  var _getPlayerGame = (0, _getPlayerGame3["default"])(games, client.id),
      _getPlayerGame2 = _slicedToArray(_getPlayerGame, 2),
      player = _getPlayerGame2[0],
      game = _getPlayerGame2[1];

  var selectedBox = new _SelectedBox["default"]({
    boxId: boxId,
    player: player,
    game: game
  });
  var emit = false;

  if (selectedBox.verification) {
    if (!game.board.history.exist(selectedBox.boxId)) {
      // if we have already one pawns selected
      if (game.board.history.length() > 0) {
        if (selectedBox.typePawns === "empty") {
          var move = game.board.moveBoxes(selectedBox);

          if (move) {
            // Remove active box selection
            io.to(game.room).emit("returnVerificationSelectedBox", game.board.history.list[0]);
            var newSelectedBox = new _SelectedBox["default"]({
              boxId: boxId,
              player: player,
              game: game
            }); // Need to transform to queen

            game.board.verifySwitchQueen(newSelectedBox); // Before switch verify

            var switchHand = game.board.verifySwitchHand(newSelectedBox, selectedBox.win || false);
            if (switchHand) game.hand = game.players.filter(function (p) {
              return p.id !== player.id;
            })[0].id; // CLEAN

            game.board.history.clean();
            io.to(game.room).emit("updateGame", game); // Verify End Game

            var winner = game.board.verifyEndGame();

            if (winner) {
              games = (0, _EndGame["default"])({
                self: props.self,
                winner: game.players.filter(function (p) {
                  return p.boardPawnsId === winner;
                })[0]
              });
            }
          }
        }
      } else if (selectedBox.typePawns !== "empty") {
        game.board.history.add(selectedBox);
        emit = true;
      }
    } else {
      game.board.history.remove(selectedBox.boxId);
      emit = true;
    }
  }

  if (emit) io.to(game.room).emit("returnVerificationSelectedBox", selectedBox);
  return games;
};

var _default = Logic;
exports["default"] = _default;