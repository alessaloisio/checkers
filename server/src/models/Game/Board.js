"use strict";

import SelectedHistory from "./SelectedHistory";
import SelectedBox from "./SelectedBox";

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
        // Maybe Win Process
        const winMove = this.recursiveDiagonal(from.boxId, 2);

        for (const axe in winMove) {
          if (winMove.hasOwnProperty(axe)) {
            const arr = winMove[axe];

            if (
              arr.length > 1 &&
              arr[1] === to.boxId &&
              (this.grid[arr[0] - 1] > 0 &&
                this.grid[arr[0] - 1] !== from.typePawnsId)
            ) {
              // You WIN a pawns
              this.grid[arr[0] - 1] = 0;

              [this.grid[from.boxId - 1], this.grid[to.boxId - 1]] = [
                this.grid[to.boxId - 1],
                this.grid[from.boxId - 1]
              ];

              to.win = true;

              validateMove = true;
              break;
            }
          }
        }
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

  verifySwitchHand(selectedBox, winAction) {
    let resolve = true;

    if (winAction) {
      const winMove = this.recursiveDiagonal(selectedBox.boxId, 2);

      for (const key in winMove) {
        if (winMove.hasOwnProperty(key)) {
          const arr = winMove[key];

          if (
            arr.length > 1 &&
            this.grid[arr[1] - 1] === 0 &&
            (this.grid[arr[0] - 1] > 0 &&
              this.grid[arr[0] - 1] !== selectedBox.typePawnsId)
          ) {
            resolve = false;
            break;
          }
        }
      }
    }

    return resolve;
  }
}

export default Board;
