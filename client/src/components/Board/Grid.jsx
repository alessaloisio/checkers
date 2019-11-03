import React, { useEffect, useRef } from "react";

import { sendSelectedBox, getVerfificationSelectedBox } from "../../socket";

// Grid init
const Grid = props => {
  const gridRef = useRef(null);
  const Game = props.game;

  const handleBox = (e, id) => {
    if (Game && Game.status) {
      sendSelectedBox(id);
    }
  };

  const createBoxes = () => {
    let boxes = [];

    for (let i = 1; i < 51; i++) {
      boxes.push(
        <span
          key={i}
          id={i}
          className="case"
          onClick={e => handleBox(e, i)}
        ></span>
      );
    }

    return boxes;
  };

  const initGrid = () => {
    const grid = gridRef.current;

    // INIT VARS
    const gridWidth = grid.clientWidth,
      gridCaseDim = gridWidth / 10,
      boxes = Array.from(grid.childNodes);

    let x = 0,
      y = 0,
      key = 0;

    for (let i = 0; i < 10; i++) {
      // after first line
      if (i > 0) y += gridCaseDim;
      // after last element in line, go back to 0 or for even -case
      if (i % 2 === 0) x = 0;
      else x = -gridCaseDim;
      for (let j = 0; j < 5; j++) {
        // move case to right
        if (j > 0) x += gridCaseDim * 2;
        else x += gridCaseDim;

        // Position case
        boxes[key].style.left = `${x}px`;
        boxes[key++].style.top = `${y}px`;
      }
    }
  };

  // 1st mount
  useEffect(() => {
    initGrid();
  }, []);

  // Update Grid
  useEffect(() => {
    if (Game) {
      const updateGrid = () => {
        const boxes = Array.from(gridRef.current.childNodes);

        let boardPawnsId = Game.players.filter(
          player => player.id === props.playerId
        )[0].boardPawnsId;

        let iterator = boardPawnsId === 1 ? 49 : 0;

        for (let i = 0; i < boxes.length; i++) {
          const box = boxes[i];
          const pawns = document.createElement("span");

          // RESET BOX
          box.innerHTML = "";

          switch (Game.board.grid[iterator]) {
            case 1:
              pawns.classList.add("black");
              break;
            case 2:
              pawns.classList.add("white");
              break;
            case "1a":
              pawns.classList.add("black");
              pawns.classList.add("queen");
              break;
            case "2a":
              pawns.classList.add("white");
              pawns.classList.add("queen");
              break;
            default:
          }

          if (Game.board.grid[iterator]) box.appendChild(pawns);

          if (boardPawnsId > 1) iterator++;
          else iterator--;
        }
      };

      // common grid between opponents
      updateGrid();
    }
  }, [Game, props.playerId]);

  // On selectedBox
  useEffect(() => {
    getVerfificationSelectedBox((err, value) => {
      if (value.verification) {
        const gridBox = Array.from(gridRef.current.childNodes);

        if (parseInt(("" + value.typePawnsId)[0]) === 2) gridBox.reverse();

        if (props.playerId === value.playerId)
          gridBox[50 - value.boxId].classList.toggle("active");
        else gridBox[value.boxId - 1].classList.toggle("active");
      }
    });
  }, [props.playerId]);

  return (
    <div ref={gridRef} className="grid">
      {createBoxes()}
    </div>
  );
};

export default Grid;
