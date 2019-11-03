import React, { useState, useEffect } from "react";

import {
  playerJoined,
  getPlayerInfo,
  getGameUpdate,
  sendPlayerGiveUp
} from "../../socket";
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

      if (Game) setGame(null);
    });

    // Detect if a oppenent joined the room
    playerJoined((err, game) => {
      setGame(game);
    });
  }, [Game, StatusPlayer, PlayerId]);

  // UPDATE GAME
  useEffect(() => {
    getGameUpdate((err, game) => {
      setGame(game);
    });
  }, [Game]);

  const infoMessage = () => {
    let message = "";

    // waiting a opponent in the room
    if (StatusPlayer >= 1 && !Game) message = "Search Opponent";
    else if (Game && !Game.status) {
      if (PlayerId === Game.winnerId) message = "You win !";
      else message = "End Game";
    }

    if (message !== "") {
      return (
        <div className="infos-message">
          <h2>{message}</h2>
        </div>
      );
    }
  };

  const playersInfoGUI = () => {
    // Opponent Joined
    if (Game && Game.status) {
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
            <span className="versus">vs</span>
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

  const handleGiveUp = () => {
    sendPlayerGiveUp(PlayerId);
  };

  const gameInfoGUI = () => {
    if (Game && Game.status) {
      return (
        <div className="game-infos">
          <button onClick={handleGiveUp}>Give Up</button>
        </div>
      );
    }
  };

  return (
    <div className="Board">
      {infoMessage()}
      <div className="container">
        {playersInfoGUI()}
        {importGrid()}
        {gameInfoGUI()}
      </div>
    </div>
  );
};

export default Board;
