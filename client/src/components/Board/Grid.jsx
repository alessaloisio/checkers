import React, { useEffect, useRef, useState } from "react";

import {
  sendSelectedBox,
  getVerfificationSelectedBox,
  moveSelectedBox
} from "../../socket";

// Grid init
const Grid = props => {
  const gridRef = useRef(null);
  const Game = props.game;

  // tourPlayer => qui joue, celui qui à la main
  // firstSelectedBox => une case avec un pion
  // secondSelectedBox => une case vide
  const [SelectedBoxes, setSelectedBoxes] = useState([]);

  const handleBox = (e, id) => {
    if (Game) {
      // await player hand verification
      if (SelectedBoxes.length < 2) {
        // await selection verification
        sendSelectedBox(id);
        // console.log(SelectedBoxes);
      } else {
        // await move verification
      }
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

  // 1st mounted
  useEffect(() => {
    initGrid();
  }, []);

  const initGrid = () => {
    const grid = gridRef.current;

    // INIT VARS
    const gridWidth = grid.clientWidth,
      // gridHeight = grid.clientHeight,
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

  // when opponents ready
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
            default:
          }

          if (Game.board.grid[iterator] > 0) box.appendChild(pawns);

          if (boardPawnsId > 1) iterator++;
          else iterator--;
        }
      };

      // common grid between opponents
      updateGrid();
    }
  }, [Game, props.playerId]);

  // Get return verification selectedBox
  useEffect(() => {
    getVerfificationSelectedBox((err, value) => {
      console.log(value);
      if (value.verification) {
        const gridBox = Array.from(gridRef.current.childNodes);
        if (props.playerId === value.playerId) {
          // hand player
          gridBox[50 - value.boxId].classList.toggle("active");
        } else {
          gridBox[value.boxId - 1].classList.toggle("active");
        }
      }
    });
  });

  // Get move box
  useEffect(() => {
    moveSelectedBox((err, value) => {
      console.log(value);
    });
  });

  return (
    <div ref={gridRef} className="grid">
      {createBoxes()}
    </div>
  );
};

export default Grid;
