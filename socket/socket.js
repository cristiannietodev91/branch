const Server = require("socket.io");

class socket {
  constructor(http) {
    this.http = http;
    this.init();
    this.connect();
  }

  init() {
    this.io = new Server(this.http, {
      transports: ["websocket"],
    });
  }

  connect() {
    this.io.on("connection", (socket) => {
      console.log("a user connected");
      socket.on("joinroom", (idroom, callback) => {
        console.log("Trying to join room ", idroom);
        socket.join(idroom, () => {
          callback({
            status: "OK",
            message: "Se unio exitosamente al room" + idroom,
          });
        });
      });

      socket.on("messaggetosomeone", (id, msg) => {
        console.log("Params received :::>", id, "messsage ::>", msg);
        // send a private message to the socket with the given id
        socket.to(id).emit("sendmessage", msg);
      });

      socket.on("message", (message) => {
        console.log("message ::::>", message);
        socket.emit("message", message);
      });
    });
  }
}

module.exports = socket;
