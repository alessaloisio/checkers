"use strict";

import Board from "./Game/Board";

class Game {
  constructor(player1, player2) {
    this.room = player1.id;
    this.hand = player1.id;

    this.players = [player1, player2];
    this.initPawnsId();

    this.board = new Board();
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

  currentPlayer() {
    return this.players.filter(player => player.id === this.hand)[0];
  }
}

export default Game;
