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
    let validateMove = false;

    const from = this.history.list[0];

    if (from.typePawns === "normal") {
      const simpleMove = [].concat(
        ...Object.values(this.recursiveDiagonal(from.boxId, 1))
      );

      if (simpleMove.includes(to.boxId)) {
        // SWAP destructuring
        [this.grid[from.boxId - 1], this.grid[to.boxId - 1]] = [
          this.grid[to.boxId - 1],
          this.grid[from.boxId - 1]
        ];

        validateMove = true;
      } else {
        /**
         * Maybe win a pawns
         */
        console.log("maybe win a pawns");
        const winMove = this.recursiveDiagonal(from.boxId, 2);

        console.log(winMove);
      }
    } else if (from.typePawns === "queen") {
      console.log("move queen");
    }

    return validateMove;
  }

  recursiveDiagonal(id, limit = null, currentAxe = null) {
    let availableSelection = { ...this.getDiagonalBox(id) };
    // To show one value limit have to be 0
    if (limit) limit--;

    if (limit > 0 || limit === null) {
      // Stop Recursive
      if (currentAxe && !availableSelection[currentAxe].length) return {};

      // EVERY AXES (TL,TR, BL, BR)
      for (const axe in availableSelection) {
        if (availableSelection.hasOwnProperty(axe)) {
          const axeDiagonalId = availableSelection[axe];

          if (axeDiagonalId.length) {
            if (!currentAxe || axe === currentAxe) {
              const addDiagonal = this.recursiveDiagonal(
                axeDiagonalId[0],
                --limit,
                axe
              )[axe];

              if (typeof addDiagonal !== "undefined")
                availableSelection[axe] = [
                  ...availableSelection[axe],
                  ...addDiagonal
                ];
            }
          }
        }
      }
    }

    return availableSelection;
  }

  getDiagonalBox(id) {
    let availableSelection = {
      TL: [],
      TR: [],
      BL: [],
      BR: []
    };

    let iterator = 0;
    if (id % 10 < 1 || id % 10 > 5) iterator--;

    // TopLeft
    if (id > 5 && ![6, 16, 26, 36, 46].includes(id))
      availableSelection["TL"].push(iterator + id - 5);

    // TopRight
    if (id > 5 && ![15, 25, 35, 45].includes(id))
      availableSelection["TR"].push(iterator + id - 4);

    // BottomLeft
    if (id < 46 && ![6, 16, 26, 36].includes(id))
      availableSelection["BL"].push(iterator + id + 5);

    // BottomRight
    if (id < 45 && ![5, 15, 25, 35].includes(id))
      availableSelection["BR"].push(iterator + id + 6);

    return availableSelection;
  }
}

export default Board;
