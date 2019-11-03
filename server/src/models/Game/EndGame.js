"use strict";

import getPlayerGame from "./getPlayerGame";

const EndGame = props => {
  const { io, client } = props.self;
  let { games } = props.self;
  const winner = props.winner;
  const [player, game] = getPlayerGame(games, client.id);

  if (game) {
    game.status = 0;

    if (typeof winner === "undefined")
      game.winnerId = game.players.filter(p => p.id !== player.id)[0].id;
    else game.winnerId = winner.id;

    game.board.grid = [];

    io.to(game.room).emit("updateGame", game);

    // Remove Game from games Array
    games = games.filter(g => g.room !== game.room);
  }
};

export default EndGame;
