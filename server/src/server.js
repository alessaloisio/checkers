import socket from "socket.io";

import User from "./models/Users";

const io = socket();

const clients = {};

io.on("connection", client => {
  const player = new User();
  console.log(player);

  // VEFIFICATION JWT

  // New connection
  client.on("subscribe", username => {
    console.log(`client ${username} is subsribing`);

    self.username = username;

    client.emit("subscribed", {
      name: username,
      score: 0
    });
  });

  // Disconnected
  client.on("disconnect", () => {
    console.log(`Client  disconnected`);
  });
});

// START SERVER
const port = process.env.port || 5005;

io.listen(port);
console.log(`Socket.io listening on port ${port}`);
