class SelectedBox {
  constructor(params) {
    this.playerId = params[2];
    this.boxSelected = params[1];
    this.verification = params[0];
    this.typePawns = this.initTypePawns(params[3]);
  }

  initTypePawns(idPawns) {
    // "normal" or "queen" or "empty"

    return idPawns;
  }
}

export default SelectedBox;
