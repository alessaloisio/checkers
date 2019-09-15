import socket from "socket.io";

import Player from "./models/Player";

const io = socket();

io.on("connection", client => {
  // On connection create a new Player
  const player = new Player();

  // We notify userInfo are created to client
  client.emit("playerInfo", player.token);
  console.log(player);
  console.log("\n");

  // Change Player Name
  client.on("changeName", username => {
    player.name = username;
    player.encodeToken();
    client.emit("playerInfo", player.token);
    console.log(player);
  });

  // New connection
  client.on("playBtn", () => {
    console.log(`client ${player.name} want to play !`);

    // FIRST CLIENT CREATE GAME IN A ROOM,
    // SECOND CLIENT JOIN THE GAME

    // IF ANOTHER CLIENT JOIN START THE GAME
    // TOKENIZE ?
    client.emit("startGame", {
      score: 0,
      board: {}
    });
  });

  // Disconnected
  client.on("disconnect", () => {
    console.log(`Client ${player.name} disconnected`);
  });
});

// START SERVER
const port = process.env.port || 5005;
io.listen(port);
console.log(`Socket.io listening on port ${port}`);
