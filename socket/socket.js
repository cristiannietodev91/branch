const Server = require("socket.io");
const citaAdapter = require("../adapter/citaAdapter");
const conversacionAdapter = require("../adapter/conversacionAdapter");
const messageAdapter = require("../adapter/messageAdapter");

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
        const { user, IdTaller, IdConversacionUser } = msg;
        const { _id: IdUsuario, name: nombreusuario } = user;
        citaAdapter.getAllCitasActivasByIdUsuario(
          IdConversacionUser,
          (error, citas) => {
            if (error) {
              //TODO : Handle Error al buscar citas
            } else {
              const cita = citas[0];
              let etapa = null;

              if (cita) {
                etapa = cita.ordentrabajos[cita.ordentrabajos.length - 1];
              }
              const conversacion = {
                uid: IdConversacionUser,
                IdTaller: IdTaller,
              };

              conversacionAdapter.createOrGetConversacion(
                conversacion,
                (error, conversacion) => {
                  if (error) {
                    //TODO : Handle Error al persistir conversacion citas
                    console.error("Error al persistir conversacion", error);
                  } else {
                    const { IdConversacion } = conversacion;
                    let message = {};
                    if (etapa) {
                      message = {
                        _id: msg._id,
                        IdConversacion: IdConversacion,
                        text: msg.text,
                        image: msg.image,
                        cita: etapa.IdCita,
                        delivered: true,
                        read: false,
                        user: {
                          _id: IdUsuario,
                          name: nombreusuario,
                        },
                        typeusuario: "test",
                        uid: IdUsuario,
                        nombreusuario: nombreusuario,
                        IdEtapa: etapa.IdEtapa,
                        IdOrdenTrabajo: etapa.IdOrdenTrabajo,
                        createdAt: msg.createdAt,
                      };
                    } else {
                      message = {
                        _id: msg._id,
                        IdConversacion: IdConversacion,
                        text: msg.text,
                        image: msg.image,
                        delivered: true,
                        read: false,
                        user: {
                          _id: IdUsuario,
                          name: nombreusuario,
                        },
                        typeusuario: "test",
                        createdAt: msg.createdAt,
                      };
                    }

                    messageAdapter.createMessage(message, (error, message) => {
                      if (error) {
                        console.log("Error al persistir el mensaje", error);
                        //TODO: Handle de mensaje
                      } else {
                        console.log(
                          "Se persistio el mensaje exitosamente",
                          message
                        );
                      }
                    });

                    console.log("Etapa activa", message);

                    socket.to(id).emit("sendmessage", message);
                  }
                }
              );
            }
          }
        );
      });

      socket.on("message", (message) => {
        console.log("message ::::>", message);
        socket.emit("message", message);
      });
    });
  }
}

module.exports = socket;
