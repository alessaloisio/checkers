import React, { useRef, useEffect } from "react";

import "./Board.scss";

const Board = () => {
  const gridRef = useRef(null);
  let self = {};

  const initGrid = grid => {
    console.log(grid);
    grid = grid.current;

    // INIT VARS
    self.gridWidth = grid.clientWidth;
    self.gridHeight = grid.clientHeight;
    self.gridCaseDim = self.gridWidth / 10;

    let x = 0,
      y = 0,
      key = 0;

    for (let i = 0; i < 10; i++) {
      // after first line
      if (i > 0) y += self.gridCaseDim;

      // after last element in line, go back to 0 or for even -case
      if (i % 2 === 0) x = 0;
      else x = -self.gridCaseDim;

      for (let j = 0; j < 5; j++) {
        // move case to right
        if (j > 0) x += self.gridCaseDim * 2;
        else x += self.gridCaseDim;

        const gridCase = document.createElement("span");
        // init case id
        gridCase.id = ++key;
        gridCase.classList.add("case");

        // Position case
        gridCase.style.left = `${x}px`;
        gridCase.style.top = `${y}px`;

        // if key >= 1 && key <= 20 | player 1
        // if key >= 31| player 2
        // add => pawn white | black

        grid.appendChild(gridCase);
      }
    }
  };

  useEffect(() => {
    initGrid(gridRef);
  });

  return (
    <div className="Board">
      <div className="container">
        <div ref={gridRef} className="grid"></div>
      </div>
    </div>
  );
};

export default Board;
