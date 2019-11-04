import openSocket from "socket.io-client";
import jwt from "jsonwebtoken";

const socket = openSocket(
  window.location.protocol + "://" + window.location.hostname + ":5005"
);

// window.location.protocol + "://" + window.location.hostname
console.log(socket);

/**
 * When a client open a tab, server generate a new User()
 * After generating UUID, Player Name and Token server emit "newPlayer"
 * We decode the token, to get default information
 */
const getPlayerInfo = cb => {
  socket.on("playerInfo", token => cb(null, jwt.decode(token).user));
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

const sendSelectedBox = id => {
  socket.emit("selectedBox", id);
};

const getVerfificationSelectedBox = cb => {
  socket.on("returnVerificationSelectedBox", value => cb(null, value));
};

const getGameUpdate = cb => {
  socket.on("updateGame", game => cb(null, game));
};

const sendPlayerGiveUp = () => {
  socket.emit("playerGiveUp", null);
};

const sendLeaveRoom = room => {
  socket.emit("leaveRoom", room);
};

export {
  getPlayerInfo,
  changeNamePlayer,
  playBtn,
  playerJoined,
  sendSelectedBox,
  getVerfificationSelectedBox,
  getGameUpdate,
  sendPlayerGiveUp,
  sendLeaveRoom
};
