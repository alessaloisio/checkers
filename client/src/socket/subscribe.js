import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:5005");

const subscribe = (cb, username) => {
  socket.emit("subscribe", username);
  socket.on("subscribed", subscribed => cb(null, subscribed));
};

export { subscribe };
