const io = require("socket.io")();

io.on("connection", client => {
  // New connection
  client.on("subscribe", username => {
    console.log(`client ${username} is subsribing`);

    this.username = username;

    client.emit("subscribed", {
      name: username,
      score: 0
    });
  });

  // Disconnected
  client.on("disconnect", () => {
    console.log(`Client ${this.username} disconnected`);
  });
});

// START SERVER
const port = process.env.port || 5005;

io.listen(port);
console.log(`Socket.io listening on port ${port}`);
