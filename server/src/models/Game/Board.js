"use strict";

import SelectedHistory from "./SelectedHistory";

class Board {
  constructor() {
    this.grid = this.init();
    this.history = new SelectedHistory();
  }

  init() {
    // const grid = [];

    // for (let i = 0; i < 50; i++) {
    //   // black 1 => 20
    //   // white 31 => 50
    //   if (i >= 0 && i <= 19) grid.push(1);
    //   else if (i >= 30 && i <= 49) grid.push(2);
    //   else grid.push(0);
    // }

    // DEMO DEV
    const grid = [
      0,
      0,
      1,
      0,
      1,

      0,
      1,
      0,
      0,
      0,

      0,
      2,
      0,
      0,
      0,

      0,
      0,
      "2a",
      0,
      0,

      0,
      0,
      0,
      0,
      0,

      0,
      2,
      0,
      1,
      1,

      0,
      0,
      1,
      1,
      0,

      0,
      2,
      0,
      0,
      0,

      0,
      0,
      0,
      0,
      0,

      2,
      2,
      "1a",
      2,
      0
    ];

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
        // force to take a pawns
        if (this.verifySwitchHand(from, true)) {
          // SWAP destructuring
          [this.grid[from.boxId - 1], this.grid[to.boxId - 1]] = [
            this.grid[to.boxId - 1],
            this.grid[from.boxId - 1]
          ];

          validateMove = true;
        }
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
      const queenMove = this.recursiveDiagonal(from.boxId);
      let idRemovePawn = null;

      // detect the axes
      for (const axe in queenMove) {
        if (queenMove.hasOwnProperty(axe)) {
          const arr = queenMove[axe];
          if (arr.includes(to.boxId)) {
            let nbOpponentPawns = 0;

            // verify all pawns
            for (const key in arr) {
              if (arr.hasOwnProperty(key)) {
                const boxId = arr[key];

                // stop before the final position
                if (boxId !== to.boxId) {
                  const typePawnsId = ("" + this.grid[boxId - 1])[0];
                  // not hover the same typePawns
                  if (typePawnsId !== ("" + from.typePawnsId)[0]) {
                    // verify if he win a pawn
                    if (
                      typePawnsId > 0 &&
                      typePawnsId !== ("" + from.typePawnsId)[0]
                    ) {
                      idRemovePawn = boxId;
                      nbOpponentPawns++;
                    }
                  } else {
                    validateMove = false;
                    nbOpponentPawns = 2;
                    break;
                  }
                } else break;
              }
            }

            // can't hover 2 pawns
            if (nbOpponentPawns <= 1) {
              let force = true;
              // remove && swap
              if (nbOpponentPawns) {
                this.grid[idRemovePawn - 1] = 0;
                to.win = true;
              } else {
                force = this.verifySwitchHand(from, true);
              }

              if (force) {
                [this.grid[from.boxId - 1], this.grid[to.boxId - 1]] = [
                  this.grid[to.boxId - 1],
                  this.grid[from.boxId - 1]
                ];

                validateMove = true;
              }
            }
          }
        }
      }
    }

    return validateMove;
  }

  recursiveDiagonal(id, limit = null, currentAxe = null) {
    let availableSelection = { ...this.getDiagonalBox(id) };
    // To show one value limit have to be 0
    if (limit > 0) limit--;

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
                limit > 0 ? --limit : null,
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
      if (selectedBox.typePawns === "normal") {
        const winMove = this.recursiveDiagonal(selectedBox.boxId, 2);

        for (const axe in winMove) {
          if (winMove.hasOwnProperty(axe)) {
            const arr = winMove[axe];

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
      } else if (selectedBox.typePawns === "queen") {
        const winMove = this.recursiveDiagonal(selectedBox.boxId);
        const typePawnsId = ("" + this.grid[selectedBox.boxId - 1])[0];

        console.log("\n\n", selectedBox);

        for (const axe in winMove) {
          if (winMove.hasOwnProperty(axe)) {
            const arr = winMove[axe];
            if (arr.length > 1) {
              console.log(axe, arr);
              for (let i = 0; i < arr.length; i++) {
                const boxId = arr[i];
                const currentPawnId = ("" + this.grid[boxId - 1])[0];
                const nextPawnId = ("" + this.grid[arr[i + 1] - 1])[0];
                console.log(boxId, typePawnsId, currentPawnId, nextPawnId);
                // attention arrêt quand il y a un pion du même joueur
                if (
                  currentPawnId == typePawnsId ||
                  currentPawnId === nextPawnId
                )
                  break;

                if (
                  currentPawnId > 0 &&
                  currentPawnId != typePawnsId &&
                  nextPawnId == 0
                ) {
                  resolve = false;
                  console.log("resolve");
                  break;
                }
              }

              if (!resolve) break;
            }
          }
        }
      }
    }

    return resolve;
  }

  verifySwitchQueen(selectedBox) {
    if (
      (selectedBox.typePawnsId === 1 &&
        [46, 47, 48, 49, 50].includes(selectedBox.boxId)) ||
      (selectedBox.typePawnsId === 2 &&
        [1, 2, 3, 4, 5].includes(selectedBox.boxId))
    ) {
      this.grid[selectedBox.boxId - 1] += "a";
    }
  }
}

export default Board;
