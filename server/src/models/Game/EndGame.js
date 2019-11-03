"use strict";

import getPlayerGame from "./getPlayerGame";

const EndGame = props => {
  const { io, client } = props.self;
  let { games } = props.self;
  const winner = props.winner;
  const [player, game] = getPlayerGame(games, client.id);

  if (game && game.status) {
    game.status = 0;
    game.board.grid = [];
    if (typeof winner === "undefined")
      game.winnerId = game.players.filter(p => p.id !== player.id)[0].id;
    else game.winnerId = winner.id;

    io.to(game.room).emit("updateGame", game);

    // Remove the opponent of the room
    const rooms = io.of("/").adapter.rooms;

    for (const key in rooms[game.room].sockets) {
      if (rooms[game.room].sockets.hasOwnProperty(key)) {
        rooms[game.room].sockets[key] = false;
      }
    }

    // Remove Game from games Array
    return games.filter(g => g.room !== game.room);
  }

  return null;
};

export default EndGame;
