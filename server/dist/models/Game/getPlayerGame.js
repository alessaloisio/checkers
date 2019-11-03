"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var getPlayerGame = function getPlayerGame(games, clientId) {
  for (var key in games) {
    if (games.hasOwnProperty(key)) {
      var game = games[key];

      for (var kPLayer in game.players) {
        if (game.players.hasOwnProperty(kPLayer)) {
          var player = game.players[kPLayer];
          if (player.id === clientId) return [player, game];
        }
      }
    }
  }

  return [null, null];
};

var _default = getPlayerGame;
exports["default"] = _default;