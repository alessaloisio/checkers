"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SelectedHistory =
/*#__PURE__*/
function () {
  function SelectedHistory() {
    _classCallCheck(this, SelectedHistory);

    this._listBox = [];
  }

  _createClass(SelectedHistory, [{
    key: "add",
    value: function add(box) {
      this._listBox.push(box);
    }
  }, {
    key: "remove",
    value: function remove(boxId) {
      this._listBox = this._listBox.filter(function (box) {
        return box.boxId !== boxId;
      }); // emit to clients
    }
  }, {
    key: "exist",
    value: function exist(boxId) {
      var value = this._listBox.filter(function (box) {
        return box.boxId === boxId;
      });

      return value.length > 0;
    }
  }, {
    key: "clean",
    value: function clean() {
      this._listBox = [];
    }
  }, {
    key: "length",
    value: function length() {
      return this._listBox.length;
    }
  }, {
    key: "list",
    get: function get() {
      return this._listBox;
    }
  }]);

  return SelectedHistory;
}();

var _default = SelectedHistory;
exports["default"] = _default;