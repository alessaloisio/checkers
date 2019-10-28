"use strict";

import SelectedHistory from "./SelectedHistory";

class Board {
  constructor() {
    this.grid = this.init();
    this.history = new SelectedHistory();
  }

  init() {
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

  moveBoxes(to) {
    // show available diagonal
    const from = this.history.list[0];

    const diagonalId = this.getDiagonalBox(from.boxId);
    console.log(diagonalId);

    // simple move
    if (diagonalId.includes(to.boxId)) {
      // SWAP destructuring
      [this.grid[from.boxId - 1], this.grid[to.boxId - 1]] = [
        this.grid[to.boxId - 1],
        this.grid[from.boxId - 1]
      ];

      // CLEAN
      this.history.clean();
    } else if (to.typePanws === "empty") {
      console.log("maybe win ?");
    }

    // else if win a pawns
  }

  getDiagonalBox(id) {
    let availableSelection = [];

    let iterator = 0;
    if (id % 10 < 1 || id % 10 > 5) iterator--;
    // TopLeft
    if (id > 5 && ![6, 16, 26, 36, 46].includes(id))
      availableSelection.push(iterator + id - 5);
    // TopRight
    if (id > 5 && ![15, 25, 35, 45].includes(id))
      availableSelection.push(iterator + id - 4);
    // BottomLeft
    if (id < 46 && ![6, 16, 26, 36].includes(id))
      availableSelection.push(iterator + id + 5);
    // BottomRight
    if (id < 45 && ![5, 15, 25, 35].includes(id))
      availableSelection.push(iterator + id + 6);

    return availableSelection;
  }
}

export default Board;
