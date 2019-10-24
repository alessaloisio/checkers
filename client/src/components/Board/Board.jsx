import React, { useState, useEffect } from "react";

import { playerJoined, getPlayerInfo } from "../../socket";
import Grid from "./Grid";

import "./Board.scss";

const Board = () => {
  const [Game, setGame] = useState(false);
  const [StatusPlayer, setStatusPlayer] = useState(0);
  const [PlayerId, setPlayerId] = useState(null);

  useEffect(() => {
    // Change status player
    getPlayerInfo((err, player) => {
      setStatusPlayer(player.status);
      setPlayerId(player.id);
    });

    // Detect if a oppenent joined the room
    playerJoined((err, game) => {
      setGame(game);
    });
  }, []);

  const searchOpponent = () => {
    // StatusPlayer = 1 => ready to play
    // waiting a opponent in the room
    if (StatusPlayer >= 1 && !Game) {
      return (
        <div className="search-opponent">
          <h2>Search Opponent</h2>
        </div>
      );
    }
  };

  const opponentGUI = () => {
    // Opponent Joined
    if (Game) {
      // Show opponents name
      return (
        <div className="players-opponent">
          <h2>
            {Game.players[0].id === Game.hand ? (
              <span className="round"></span>
            ) : (
              ""
            )}
            <span
              className={
                Game.players[0].id === PlayerId ? "active player" : "player"
              }
            >
              {Game.players[0].name}
            </span>
            vs
            {Game.players[1].id === Game.hand ? (
              <span className="round"></span>
            ) : (
              ""
            )}
            <span
              className={
                Game.players[1].id === PlayerId ? "active player" : "player"
              }
            >
              {Game.players[1].name}
            </span>
          </h2>
        </div>
      );
    }
  };

  const importGrid = () => {
    if (PlayerId) return <Grid game={Game} playerId={PlayerId} />;
  };

  return (
    <div className="Board">
      {searchOpponent()}
      <div className="container">
        {opponentGUI()}
        {importGrid()}
      </div>
    </div>
  );
};

export default Board;
