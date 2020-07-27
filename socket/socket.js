const Server = require("socket.io");
const citaAdapter = require("../adapter/citaAdapter");
const conversacionAdapter = require("../adapter/conversacionAdapter");
const messageAdapter = require("../adapter/messageAdapter");
const usuarioAdapter = require("../adapter/userAdapter");
const sms = require("../utils/sendSms");
const moment = require("moment");

class socket {
  constructor(http) {
    this.http = http;
    this.init();
    this.connect();
  }

  init() {
    this.io = new Server(this.http, {
      transports: ["websocket"]
    });
  }

  connect() {
    this.io.on("connection", (socket) => {
      console.log("a user connected");
      socket.on("joinroom", (params, callback) => {
        const { room, IdTaller } = params;
        console.log("Trying to join room ", room, "IdTaller ::>", IdTaller);
        if (IdTaller) {
          console.log(
            "Emit new cliente to taller :::::>",
            IdTaller,
            "room :::>",
            room
          );
          socket.to(IdTaller).emit("newcliente", { room: room });
        }
        socket.join(room, () => {
          callback({
            status: "OK",
            message: "Se unio exitosamente al room" + room
          });
        });
      });

      socket.on("jointaller", (IdTaller, callback) => {
        socket.join(IdTaller, () => {
          callback({
            status: "OK",
            message: "Se unio exitosamente el Taller" + IdTaller
          });
        });
      });

      socket.on("messaggetosomeone", (id, msg) => {
        console.log("Params received :::>", id, "messsage ::>", msg);
        // send a private message to the socket with the given id
        const { user, IdTaller, IdConversacionUser, typeusuario } = msg;
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
                IdTaller: IdTaller
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
                          name: nombreusuario
                        },
                        typeusuario: typeusuario,
                        uid: IdUsuario,
                        nombreusuario: nombreusuario,
                        IdEtapa: etapa.IdEtapa,
                        IdOrdenTrabajo: etapa.IdOrdenTrabajo,
                        createdAt: msg.createdAt
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
                          name: nombreusuario
                        },
                        typeusuario: typeusuario,
                        createdAt: msg.createdAt
                      };
                    }

                    messageAdapter.createMessage(message, (error, message) => {
                      if (error) {
                        console.log("Error al persistir el mensaje", error);
                        //TODO: Handle de mensaje
                      }
                    });

                    if (typeusuario == "taller") {
                      usuarioAdapter.findUsuarioByUid(
                        IdConversacionUser,
                        (error, usuario) => {
                          if (error) {
                            console.error(
                              "error al buscar usuario para enviar notificacion "
                            );
                          } else {
                            console.log("Usuario");
                            if (usuario && usuario.tokenCM) {
                              console.debug(
                                "Se envio la notificacion al usuario"
                              );
                              sms.sendNotificacionToUser(
                                usuario.tokenCM,
                                msg.text,
                                "chat",
                                { IdTaller: IdTaller }
                              );
                            }
                          }
                        }
                      );
                    }

                    socket.to(id).emit("sendmessage", message);
                  }
                }
              );
            }
          }
        );
      });

      socket.on("newcita", (data) => {
        console.log("message ::::>", data);
        //socket.emit("newcita", data);
        const { IdTaller, IdCita, IdVehiculo } = data;
        citaAdapter.findCitaByIdCita(IdCita, (error, cita) => {
          if (error) {
            console.error(
              "Error al buscar cita para enviar notificacion de nueva cita al taller",
              error
            );
          } else {
            if (cita) {
              const { vehiculo } = cita;
              console.log("vehiculo :::>", vehiculo);
              socket.to(IdTaller).emit("newcita", {
                text:
                  "se acaba de solicitar una cita para el vehiculo " +
                  vehiculo.placa +
                  " el dia " +
                  moment(cita.fechaCita).format("DD-MM-YYYY"),
                placa: vehiculo.placa
              });
            } else {
              console.debug("No se encontro una cita para enviar notificacion");
            }
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
