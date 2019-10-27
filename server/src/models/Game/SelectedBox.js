let _player = new WeakMap();
let _game = new WeakMap();

class SelectedBox {
  constructor(params) {
    _player.set(this, params[1]);
    _game.set(this, params[2]);

    this.playerId = _player.get(this).id;
    this.boxId = params[0];
    this.verification = this.playerVerification();
    this.typePawns = this.initTypePawns();
  }

  playerVerification() {
    const game = _game.get(this);
    const player = _player.get(this);

    if (player.boardPawnsId < 2) this.boxId = 51 - this.boxId;

    let value = false;
    if (this.playerId === game.hand) {
      if (
        game.board.grid[this.boxId] === player.boardPawnsId ||
        game.board.grid[this.boxId] === 0
      ) {
        value = true;
      }
    }

    return value;
  }

  initTypePawns() {
    const game = _game.get(this);
    let value;

    // "normal" or "queen" or "empty"
    switch (game.board.grid[this.boxId]) {
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
