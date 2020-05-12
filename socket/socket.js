const Server = require("socket.io");
const citaAdapter = require("../adapter/citaAdapter");

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
      socket.on("joinroom", (params, callback) => {
        const { room, IdTaller } = params;
        console.log("Trying to join room ", room, "IdTaller ::>", IdTaller);
        if (IdTaller) {
          socket.to(IdTaller).emit("newcliente", { room: room });
        }
        socket.join(room, () => {
          callback({
            status: "OK",
            message: "Se unio exitosamente al room" + room,
          });
        });
      });

      socket.on("jointaller", (IdTaller, callback) => {
        socket.join(IdTaller, () => {
          callback({
            status: "OK",
            message: "Se unio exitosamente el Taller" + IdTaller,
          });
        });
      });

      socket.on("messaggetosomeone", (id, msg) => {
        console.log("Params received :::>", id, "messsage ::>", msg);
        // send a private message to the socket with the given id
        const IdUsuario = msg.user._id;
        citaAdapter.getAllCitasActivasByIdUsuario(IdUsuario, (error, citas) => {
          if (error) {
            //TODO : Handle Error al buscar citas
          } else {
            const cita = citas[0];
            let etapa = null;
            if (cita) {
              etapa = cita.ordentrabajos[cita.ordentrabajos.length - 1];
            }
            let message = {};
            if (etapa) {
              message = {
                _id: msg._id,
                createdAt: msg.createdAt,
                text: msg.text,
                delivered: true,
                read: false,
                user: msg.user,
                cita: etapa.IdCita,
                IdOrdenTrabajo: etapa.IdOrdenTrabajo,
                etapa: etapa.IdEtapa,
                image: msg.image,
              };
            } else {
              message = {
                _id: msg._id,
                createdAt: msg.createdAt,
                text: msg.text,
                delivered: true,
                read: false,
                user: msg.user,
              };
            }

            console.log("Etapa activa", message);

            socket.to(id).emit("sendmessage", message);
          }
        });
      });

      socket.on("message", (message) => {
        console.log("message ::::>", message);
        socket.emit("message", message);
      });
    });
  }
}

module.exports = socket;
