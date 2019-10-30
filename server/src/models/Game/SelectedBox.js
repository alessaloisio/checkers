"use strict";

class SelectedBox {
  constructor(props) {
    const { boxId, player, game } = props;

    this.playerId = player.id;
    this.boxId = boxId;
    this.verification = this.playerVerification(player, game);
    this.typePawns = this.initTypePawns(game);
    this.typePawnsId = game.board.grid[this.boxId - 1];
  }

  playerVerification(player, game) {
    if (player.boardPawnsId < 2) this.boxId = 51 - this.boxId;

    let value = false;
    if (this.playerId === game.hand) {
      if (
        game.board.grid[this.boxId - 1] === 0 ||
        game.board.grid[this.boxId - 1] === player.boardPawnsId
      ) {
        value = true;
      }
    }

    return value;
  }

  initTypePawns(game) {
    let value;

    // "normal" or "queen" or "empty"
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
}

export default SelectedBox;
