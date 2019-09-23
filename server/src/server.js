import socket from "socket.io";

import Player from "./models/Player";
import Game from "./models/Game/Game";

const io = socket();
const nsps = io.of("/");
let clients = [];

io.on("connection", client => {
  /***
   * INIT PLAYER
   */
  // On connection create a new Player
  const player = new Player(client.id);

  // TIPS to know if a player is ready (putting the value to false)
  // after player ready to play we edit the value to true and we are
  // can now search a opponent with already a true value
  nsps.adapter.rooms[client.id].sockets[client.id] = false;

  // We notify userInfo => we are created a player to front
  player.encodeToken();
  client.emit("playerInfo", player.token);

  // Add players on Clients Array
  clients.push(player);
  console.log(player);
  console.log("\n");

  // Change Player Name
  client.on("changeName", username => {
    player.name = username;
    player.encodeToken();
    client.emit("playerInfo", player.token);
    console.log(player);
  });

  // Player ready to search opponent and start the game
  client.on("playBtn", () => {
    console.log(`${player.name} want to play !`);

    // FIRST CLIENT CREATE GAME IN A ROOM,
    // SECOND CLIENT JOIN THE GAME
    // DETECT AVAILABLE ROOMS for 2vs2
    const rooms = nsps.adapter.rooms;

    if (typeof rooms[client.id] !== "undefined") {
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

          // Delete current room
          client.leave(player.id);
          // Join player to a available room
          client.join(availableRoom);
          // PLAYER ROOM
          player.room = availableRoom;

          // SEND TO ALL PLAYER IN THE ROOM
          io.to(availableRoom).emit(
            "playerJoined",
            // Send player1 room owner and the player2
            new Game(
              clients.filter(client => client.id === availableRoom)[0],
              player
            )
          );
        }
      });

      player.status = 1;
      player.encodeToken();
      client.emit("playerInfo", player.token);
    }
  });

  // Disconnected
  client.on("disconnect", () => {
    console.log(`Client ${player.name} disconnected`);

    // Remove Player from clients Array
    clients = clients.filter(client => client.id !== player.id);

    // if players on room playing and one opponent leave
    // we have to notify the rival player
  });
});

// START SERVER
const port = process.env.port || 5005;
io.listen(port);
console.log(`Socket.io listening on port ${port}`);
