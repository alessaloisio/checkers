import socket from "socket.io";

import User from "./models/Users";

const io = socket();

io.on("connection", client => {
  const player = new User();
  client.emit("newPlayer", player.token);
  console.log(player);
  console.log("\n");

  // New connection
  client.on("playBtn", username => {
    // Change player.name ?
    console.log(username);

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
    console.log(`Client ${player.name}  disconnected`);
  });
});

// START SERVER
const port = process.env.port || 5005;

io.listen(port);
console.log(`Socket.io listening on port ${port}`);
