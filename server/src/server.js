import socket from "socket.io";

import Player from "./models/Player";
import RoomManager from "./models/RoomManager";
import SelectionLogic from "./models/Game/SelectionLogic";
import EndGame from "./models/Game/EndGame";

const io = socket();

let players = [];
let games = [];

io.on("connection", client => {
  const self = {
    io,
    client,
    games
  };

  // TIPS to know if a player is ready (putting the value to false)
  // after player ready to play we edit the value to true and we are
  // can now search a opponent with already a true value
  io.of("/").adapter.rooms[client.id].sockets[client.id] = false;

  const player = new Player(client.id);
  players.push(player);
  player.encodeToken();
  client.emit("playerInfo", player.token);

  /**
   * Change Player Name
   */
  client.on("changeName", username => {
    player.name = username;
    player.encodeToken();
    client.emit("playerInfo", player.token);
  });

  /**
   * Player ready to search opponent and start the game
   */
  client.on("playBtn", () => {
    console.log(`${player.name} want to play !`);

    RoomManager({
      self,
      players,
      player
    });

    /**
     * Player selected a box
     */
    client.on("selectedBox", boxId => {
      games = SelectionLogic({
        self,
        boxId
      });
    });

    /**
     * Player want to give up
     */
    client.on("playerGiveUp", () => {
      games = EndGame({ self });
    });
  });

  /**
   * Disconnected
   */
  client.on("disconnect", () => {
    console.log(`Client ${player.name} disconnected`);

    const newGames = EndGame({ self });
    if (newGames) games = newGames;
    console.log("last", games);

    // Remove Player from players Array
    players = players.filter(player => player.id !== client.id);
  });
});

// START SERVER
const port = process.env.port || 5005;
io.listen(port);

console.log(`Socket.io listening on port ${port}`);
