"use strict";

import Game from "./Game";

const Room = props => {
  const { io, client, games } = props.self;
  const { players, player } = props;
  // FIRST CLIENT CREATE GAME IN A ROOM,
  // SECOND CLIENT JOIN THE GAME
  // DETECT AVAILABLE ROOMS for 2vs2
  const rooms = io.of("/").adapter.rooms;
  if (typeof rooms[client.id] !== "undefined") {
    player.status = 1;
    player.encodeToken();
    client.emit("playerInfo", player.token);

    rooms[client.id].sockets[client.id] = true;
    Object.keys(rooms).map(room => {
      // We detect a room available with a opponent ready to play
      if (
        room !== player.id &&
        rooms[room].length <= 1 &&
        rooms[room].sockets[room]
      ) {
        // Get the available id room
        const availableRoom = Object.keys(rooms[room].sockets)[0];

        // client.leave(client.id);
        client.join(availableRoom);
        player.room = availableRoom;

        // First player1 who create the room
        const game = new Game(
          players.filter(client => client.id === availableRoom)[0],
          player
        );

        // SEND TO ALL PLAYER IN THE ROOM
        io.to(game.room).emit(
          "playerJoined",
          // Send player1 room owner and the player2
          game
        );

        game.playersOnGame();

        // List the game
        games.push(game);

        return game;
      }
    });
  }

  return;
};

export default Room;
