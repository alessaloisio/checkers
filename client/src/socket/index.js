import openSocket from "socket.io-client";
import jwt from "jsonwebtoken";

const socket = openSocket("http://localhost:5005");

const newPlayer = () => {
  return new Promise(resolve => {
    socket.on("newPlayer", token => {
      resolve(jwt.decode(token).user);
    });
  });
};

const playBtn = (cb, username) => {
  socket.emit("playBtn", username);
  socket.on("startGame", startGame => cb(null, startGame));
};

export { newPlayer, playBtn };
