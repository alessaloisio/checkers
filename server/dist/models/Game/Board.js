"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _SelectedHistory = _interopRequireDefault(require("./SelectedHistory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Board =
/*#__PURE__*/
function () {
  function Board() {
    _classCallCheck(this, Board);

    this.grid = this.init();
    this.history = new _SelectedHistory["default"]();
  }

  _createClass(Board, [{
    key: "init",
    value: function init() {
      var grid = [];

      for (var i = 0; i < 50; i++) {
        // black 1 => 20
        // white 31 => 50
        if (i >= 0 && i <= 19) grid.push(1);else if (i >= 30 && i <= 49) grid.push(2);else grid.push(0);
      }

      return grid;
    }
  }, {
    key: "moveBoxes",
    value: function moveBoxes(to) {
      var validateMove = false;
      var from = this.history.list[0];

      if (from.typePawns === "normal") {
        var _ref;

        var simpleMove = (_ref = []).concat.apply(_ref, _toConsumableArray(Object.values(this.recursiveDiagonal(from.boxId, 1))));

        if (simpleMove.includes(to.boxId)) {
          // force to take a pawns
          if (this.verifySwitchHand(from, true)) {
            // SWAP destructuring
            var _ref2 = [this.grid[to.boxId - 1], this.grid[from.boxId - 1]];
            this.grid[from.boxId - 1] = _ref2[0];
            this.grid[to.boxId - 1] = _ref2[1];
            validateMove = true;
          }
        } else {
          // Maybe Win Process
          var winMove = this.recursiveDiagonal(from.boxId, 2);

          for (var axe in winMove) {
            if (winMove.hasOwnProperty(axe)) {
              var arr = winMove[axe];
              var typePawnsId = ("" + from.typePawnsId)[0];
              var nextPawnId = ("" + this.grid[arr[0] - 1])[0];

              if (arr.length > 1 && arr[1] === to.boxId && parseInt(nextPawnId) > 0 && nextPawnId !== typePawnsId) {
                // You WIN a pawns
                this.grid[arr[0] - 1] = 0;
                var _ref3 = [this.grid[to.boxId - 1], this.grid[from.boxId - 1]];
                this.grid[from.boxId - 1] = _ref3[0];
                this.grid[to.boxId - 1] = _ref3[1];
                to.win = true;
                validateMove = true;
                break;
              }
            }
          }
        }
      } else if (from.typePawns === "queen") {
        var queenMove = this.recursiveDiagonal(from.boxId);
        var idRemovePawn = null; // detect the axes

        for (var _axe in queenMove) {
          if (queenMove.hasOwnProperty(_axe)) {
            var _arr = queenMove[_axe];

            if (_arr.includes(to.boxId)) {
              var nbOpponentPawns = 0; // verify all pawns

              for (var key in _arr) {
                if (_arr.hasOwnProperty(key)) {
                  var boxId = _arr[key]; // stop before the final position

                  if (boxId !== to.boxId) {
                    var _typePawnsId = ("" + this.grid[boxId - 1])[0]; // not hover the same typePawns

                    if (_typePawnsId !== ("" + from.typePawnsId)[0]) {
                      // verify if he win a pawn
                      if (_typePawnsId > 0 && _typePawnsId !== ("" + from.typePawnsId)[0]) {
                        idRemovePawn = boxId;
                        nbOpponentPawns++;
                      }
                    } else {
                      validateMove = false;
                      nbOpponentPawns = 2;
                      break;
                    }
                  } else break;
                }
              } // can't hover 2 pawns


              if (nbOpponentPawns <= 1) {
                var force = true; // remove && swap

                if (nbOpponentPawns) {
                  this.grid[idRemovePawn - 1] = 0;
                  to.win = true;
                } else {
                  force = this.verifySwitchHand(from, true);
                }

                if (force) {
                  var _ref4 = [this.grid[to.boxId - 1], this.grid[from.boxId - 1]];
                  this.grid[from.boxId - 1] = _ref4[0];
                  this.grid[to.boxId - 1] = _ref4[1];
                  validateMove = true;
                }
              }
            }
          }
        }
      }

      return validateMove;
    }
  }, {
    key: "recursiveDiagonal",
    value: function recursiveDiagonal(id) {
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var currentAxe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var availableSelection = _objectSpread({}, this.getDiagonalBox(id)); // To show one value limit have to be 0


      if (limit > 0) limit--;

      if (limit > 0 || limit === null) {
        // Stop Recursive
        if (currentAxe && !availableSelection[currentAxe].length) return {}; // EVERY AXES (TL,TR, BL, BR)

        for (var axe in availableSelection) {
          if (availableSelection.hasOwnProperty(axe)) {
            var axeDiagonalId = availableSelection[axe];

            if (axeDiagonalId.length) {
              if (!currentAxe || axe === currentAxe) {
                var addDiagonal = this.recursiveDiagonal(axeDiagonalId[0], limit > 0 ? --limit : null, axe)[axe];
                if (typeof addDiagonal !== "undefined") availableSelection[axe] = [].concat(_toConsumableArray(availableSelection[axe]), _toConsumableArray(addDiagonal));
              }
            }
          }
        }
      }

      return availableSelection;
    }
  }, {
    key: "getDiagonalBox",
    value: function getDiagonalBox(id) {
      var availableSelection = {
        TL: [],
        TR: [],
        BL: [],
        BR: []
      };
      var iterator = 0;
      if (id % 10 < 1 || id % 10 > 5) iterator--; // TopLeft

      if (id > 5 && ![6, 16, 26, 36, 46].includes(id)) availableSelection["TL"].push(iterator + id - 5); // TopRight

      if (id > 5 && ![15, 25, 35, 45].includes(id)) availableSelection["TR"].push(iterator + id - 4); // BottomLeft

      if (id < 46 && ![6, 16, 26, 36].includes(id)) availableSelection["BL"].push(iterator + id + 5); // BottomRight

      if (id < 45 && ![5, 15, 25, 35].includes(id)) availableSelection["BR"].push(iterator + id + 6);
      return availableSelection;
    }
  }, {
    key: "verifySwitchHand",
    value: function verifySwitchHand(selectedBox, winAction) {
      var resolve = true;

      if (winAction) {
        if (selectedBox.typePawns === "normal") {
          var winMove = this.recursiveDiagonal(selectedBox.boxId, 2);

          for (var axe in winMove) {
            if (winMove.hasOwnProperty(axe)) {
              var arr = winMove[axe];
              var firstPawnId = ("" + this.grid[arr[0] - 1])[0];
              var secondPawnId = ("" + this.grid[arr[1] - 1])[0];

              if (arr.length > 1 && parseInt(secondPawnId) === 0 && parseInt(firstPawnId) > 0 && firstPawnId !== selectedBox.typePawnsId) {
                resolve = false;
                break;
              }
            }
          }
        } else if (selectedBox.typePawns === "queen") {
          var _winMove = this.recursiveDiagonal(selectedBox.boxId);

          var typePawnsId = ("" + this.grid[selectedBox.boxId - 1])[0];

          for (var _axe2 in _winMove) {
            if (_winMove.hasOwnProperty(_axe2)) {
              var _arr2 = _winMove[_axe2];

              if (_arr2.length > 1) {
                for (var i = 0; i < _arr2.length; i++) {
                  var boxId = _arr2[i];
                  var currentPawnId = ("" + this.grid[boxId - 1])[0];
                  var nextPawnId = ("" + this.grid[_arr2[i + 1] - 1])[0]; // attention arrêt quand il y a un pion du même joueur

                  if (currentPawnId == typePawnsId || currentPawnId === nextPawnId) break;

                  if (currentPawnId > 0 && currentPawnId != typePawnsId && nextPawnId == 0) {
                    resolve = false;
                    break;
                  }
                }

                if (!resolve) break;
              }
            }
          }
        }
      }

      return resolve;
    }
  }, {
    key: "verifySwitchQueen",
    value: function verifySwitchQueen(selectedBox) {
      if (selectedBox.typePawnsId === 1 && [46, 47, 48, 49, 50].includes(selectedBox.boxId) || selectedBox.typePawnsId === 2 && [1, 2, 3, 4, 5].includes(selectedBox.boxId)) {
        this.grid[selectedBox.boxId - 1] += "a";
      }
    }
  }, {
    key: "verifyEndGame",
    value: function verifyEndGame() {
      var winner = false;
      var player1 = 0,
          player2 = 0;
      this.grid.map(function (p) {
        var pawn = parseInt(("" + p)[0]);
        if (pawn === 1) player1++;else if (pawn === 2) player2++;
      });
      if (player1 === 0) winner = 2;else if (player2 === 0) winner = 1;
      return winner;
    }
  }]);

  return Board;
}();

var _default = Board;
exports["default"] = _default;