import React, { useState, useEffect } from "react";

import { playerJoined, getPlayerInfo } from "../../socket";
import Grid from "./Grid";

import "./Board.scss";

const Board = () => {
  const [Opponent, setOpponent] = useState(false);
  const [StatusPlayer, setStatusPlayer] = useState(0);
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    // Change status player
    getPlayerInfo((err, player) => {
      setStatusPlayer(player.status);
      setPlayerId(player.id);
    });

    // Detect if a oppenent joined the room
    playerJoined((err, opponent) => {
      setOpponent(opponent);
    });
  }, [Opponent, StatusPlayer, playerId]);

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

  const opponentGUI = () => {
    // Opponent Joined
    if (Opponent) {
      // Show opponents name
      return (
        <div className="players-opponent">
          <h2>
            <span className={Opponent.player1.id === playerId ? "active" : ""}>
              {Opponent.player1.name}
            </span>{" "}
            vs
            <span className={Opponent.player2.id === playerId ? "active" : ""}>
              {Opponent.player2.name}
            </span>
          </h2>
        </div>
      );
    }
  };

  return (
    <div className="Board">
      {searchOpponent()}
      <div className="container">
        {opponentGUI()}
        <Grid ready={Opponent} />
      </div>
    </div>
  );
};

export default Board;
