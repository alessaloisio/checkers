"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _v = _interopRequireDefault(require("uuid/v4"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Player =
/*#__PURE__*/
function () {
  function Player(id) {
    _classCallCheck(this, Player);

    // generate universal unique identifier
    this.uuid = (0, _v["default"])();
    this.id = id;
    this.room = id; // random name

    this.name = this.randomName(); // (connected = 0|readyToPlay = 1|onGame = 2|..)

    this.status = 0;
    this.boardPawnsId = 0; // generate jwt

    this.token = null;
  }

  _createClass(Player, [{
    key: "randomName",
    value: function randomName() {
      var sum = 0;
      Array.from(this.uuid).map(function (x) {
        x = parseInt(x);
        if (x) sum += x;
      });
      return "player" + sum;
    }
  }, {
    key: "encodeToken",
    value: function encodeToken() {
      var data = _objectSpread({}, this);

      delete data.token;
      this.token = _jsonwebtoken["default"].sign({
        user: data
      }, process.env.SECRET_KEY, {
        expiresIn: "1h"
      });
    }
  }, {
    key: "decodeToken",
    value: function decodeToken() {
      return _jsonwebtoken["default"].decode(this.token);
    }
  }]);

  return Player;
}();

var _default = Player;
exports["default"] = _default;