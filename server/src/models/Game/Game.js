"use strict";

class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.room = player1.id;
  }
}

export default Game;
