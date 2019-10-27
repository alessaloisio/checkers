import socket from "socket.io";

import Player from "./models/Player";
import RoomManager from "./models/RoomManager";

import SelectedBox from "./models/Game/SelectedBox";

const io = socket();
const nsps = io.of("/");

let players = [];
let games = [];

io.on("connection", client => {
  // TIPS to know if a player is ready (putting the value to false)
  // after player ready to play we edit the value to true and we are
  // can now search a opponent with already a true value
  nsps.adapter.rooms[client.id].sockets[client.id] = false;

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
    console.log(player);
  });

  /**
   * Player ready to search opponent and start the game
   */
  client.on("playBtn", () => {
    console.log(`${player.name} want to play !`);

    const game = RoomManager({
      io,
      client,
      players,
      games,
      player
    });

    /**
     * Player selected a box
     */
    client.on("selectedBox", boxId => {
      // get the game of the client
      const game = games.filter(game => {
        return game.players.filter(client => client.id === player.id)[0];
      })[0];

      const selectedBox = new SelectedBox([boxId, player, game]);
      console.log(selectedBox);

      let emit = false;

      if (selectedBox.verification) {
        if (!game.board.history.exist(selectedBox.boxId)) {
          // if we have already one pawns selected
          if (game.board.history.length() > 0) {
            if (selectedBox.typePawns === "empty") {
              // determine the best move

              game.board.moveBoxes(selectedBox);

              // send game
              // io.to(game.room).emit("updateGame", game);
            }
          } else if (selectedBox.typePawns !== "empty") {
            game.board.history.add(selectedBox);
            emit = true;
          }
        } else {
          game.board.history.remove(selectedBox.boxId);
          emit = true;
        }
      }

      if (emit)
        io.to(game.room).emit("returnVerificationSelectedBox", selectedBox);
    });
  });

  /**
   * Disconnected
   */
  client.on("disconnect", () => {
    console.log(`Client ${player.name} disconnected`);

    // Remove Player from players Array
    players = players.filter(client => client.id !== player.id);

    // if players on room playing and one opponent leave
    // we have to notify the rival player
  });
});

// START SERVER
const port = process.env.port || 5005;
io.listen(port);
console.log(`Socket.io listening on port ${port}`);
