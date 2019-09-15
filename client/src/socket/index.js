import openSocket from "socket.io-client";
import jwt from "jsonwebtoken";

const socket = openSocket("http://localhost:5005");

/**
 * When a client open a tab, server generate a new User()
 * After generating UUID, Player Name and Token server emit "newPlayer"
 * We decode the token, to get default information
 */
const infoPlayer = () => {
  return new Promise(resolve => {
    socket.on("playerInfo", token => {
      resolve(jwt.decode(token).user);
    });
  });
};

const changeNamePlayer = username => {
  socket.emit("changeName", username);
};

const playBtn = cb => {
  socket.emit("playBtn");
  socket.on("startGame", startGame => cb(null, startGame));
};

const playerJoined = cb => {
  socket.on("playerJoined", room => cb(null, room));
};

export { infoPlayer, changeNamePlayer, playBtn, playerJoined };
