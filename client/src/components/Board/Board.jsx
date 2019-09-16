import React, { useRef, useState, useEffect } from "react";
import "./Board.scss";

import { playerJoined, getPlayerInfo } from "../../socket";

const Board = () => {
  let self = {};

  const gridRef = useRef(null);
  const [Opponent, setOpponent] = useState(false);
  const [StatusPlayer, setStatusPlayer] = useState(0);

  const initGrid = grid => {
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
    // Init only once !
    if (gridRef.current.childNodes.length === 0) initGrid(gridRef);

    // Change status player
    getPlayerInfo((err, player) => {
      setStatusPlayer(player.status);
      console.log(player);
    });

    // Detect if a oppenent joined the room
    playerJoined((err, oppenent) => {
      setOpponent(oppenent);
    });
  });

  const searchOpponent = () => {
    // StatusPlayer = 1 => ready to play
    // waiting a opponent in the room
    if (StatusPlayer >= 1 && !Opponent) {
      return (
        <div className="search-opponent">
          <h2>Search Opponent</h2>
        </div>
      );
    }
  };

  return (
    <div className="Board">
      {searchOpponent()}
      <div className="container">
        <div ref={gridRef} className="grid"></div>
      </div>
    </div>
  );
};

export default Board;
