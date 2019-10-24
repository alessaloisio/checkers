"use strict";

import SelectedHistory from "./SelectedHistory";

class Game {
  constructor(player1, player2, broadcast) {
    this.room = player1.id;
    this.players = [player1, player2];
    this.initPawnsId();

    this.hand = player1.id; // determine who have to play
    this.board = this.initGame();

    this.history = new SelectedHistory();
  }

  initGame() {
    const grid = [];

    for (let i = 0; i < 50; i++) {
      // black 1 => 20
      // white 31 => 50
      if (i >= 0 && i <= 19) grid.push(1);
      else if (i >= 30 && i <= 49) grid.push(2);
      else grid.push(0);
    }

    return grid;
  }

  playersOnGame() {
    this.players[0].status = 2;
    this.players[1].status = 2;
  }

  initPawnsId() {
    // 1 => black pawns
    // 2 => white pawns
    this.players[0].boardPawnsId = 1;
    this.players[1].boardPawnsId = 2;
  }
}

export default Game;
