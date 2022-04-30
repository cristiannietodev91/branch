import { Server } from "socket.io";
import citaAdapter from "../adapter/citaAdapter";
import conversacionAdapter from "../adapter/conversacionAdapter";
import messageAdapter from "../adapter/messageAdapter";
import usuarioAdapter from "../adapter/userAdapter";
import http from "http";
import { sendNotificacionToUser } from "../utils/sendSms";
import Debug from "debug";
const moment = require("moment");
const debug = Debug("branch:server");

interface InitialMessage {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  IdTaller: number;
  IdConversacionUser: string;
  typeusuario: string;
  text: string;
  image: string;
}

interface MessageBack {
  _id: string;
  IdConversacion: number;
  text: string;
  image: string;
  delivered: boolean;
  read: boolean;
  user: JSON;
  typeusuario: string;
  uid: string;
  nombreusuario: string;
  createdAt: Date;
}

interface ClientToServerEvents {
  joinroom: (
    params: { room: string; IdTaller: string },
    callback: (result: { status: string; message: string }) => void
  ) => void;
  jointaller: (
    IdTaller: string,
    callback: (result: { status: string; message: string }) => void
  ) => void;
  messaggetosomeone: (id: string, msg: InitialMessage) => void;
  newcita: (data: { IdTaller: string; IdCita: string }) => void;
}

interface ServerToClientEvents {
  newcliente: (params: { room: string }) => void;
  sendmessage: (msg: MessageBack) => void;
  newcita: (result: { text: string; placa: string }) => void;
}

interface InterServerEvents {
  ping: () => void;
}

export default class socket {
  io!: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    any
  >;

  constructor(http: http.Server) {
    this.io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >(http, {
      transports: ["websocket"],
      allowEIO3: true
    });
    this.connect();
  }

  connect() {
    this.io.on("connection", (socket) => {
      debug("a user connected");
      socket.on("joinroom", (params, callback) => {
        const { room, IdTaller } = params;
        debug("Trying to join room ", room, "IdTaller ::>", IdTaller);
        if (IdTaller) {
          debug(
            "Emit new cliente to taller :::::>",
            IdTaller,
            "room :::>",
            room
          );
          socket.to(IdTaller).emit("newcliente", { room: room });
        }
        socket.join(room);
        callback({
          status: "OK",
          message: "Se unio exitosamente al room" + room,
        });
      });

      socket.on("jointaller", (IdTaller, callback) => {
        socket.join(IdTaller);
        callback({
          status: "OK",
          message: "Se unio exitosamente el Taller" + IdTaller,
        });
      });

      socket.on("messaggetosomeone", (id, msg) => {
        debug("Params received :::>", id, "messsage ::>", msg);
        // send a private message to the socket with the given id
        const {
          user,
          IdTaller,
          IdConversacionUser,
          typeusuario,
          text,
          image,
          _id: IdMessage,
        } = msg;
        const { _id: IdUsuario, name: nombreusuario } = user;

        const conversacion = {
          uid: IdConversacionUser,
          IdTaller: IdTaller,
          keyconversacion: "1",
        };

        conversacionAdapter
          .createOrGetConversacion(conversacion)
          .then((conversacion) => {
            const { IdConversacion } = conversacion;
            const message = {
              _id: IdMessage,
              IdConversacion: IdConversacion,
              text: text,
              image: image,
              delivered: true,
              read: false,
              user: {
                _id: IdUsuario,
                name: nombreusuario,
              } as unknown as JSON,
              typeusuario: typeusuario,
              uid: IdUsuario,
              nombreusuario: nombreusuario,
              createdAt: new Date(),
            };

            messageAdapter.createMessage(message);

            if (typeusuario == "taller") {
              usuarioAdapter
                .findOneUserByFilter({ uid: IdConversacionUser })
                ?.then((usuario) => {
                  if (usuario && usuario.tokenCM) {
                    console.debug("Se envio la notificacion al usuario");
                    sendNotificacionToUser(usuario.tokenCM, msg.text, "chat", {
                      IdTaller: IdTaller,
                    });
                  }
                });
            }
            socket.to(id).emit("sendmessage", message);
          });
      });

      socket.on("newcita", (data) => {
        debug("message ::::>", data);
        //socket.emit("newcita", data);
        const { IdTaller, IdCita } = data;
        citaAdapter.findCitaByIdCita(IdCita)?.then((cita) => {
          if (cita) {
            const { vehiculo } = cita;
            debug("vehiculo :::>", vehiculo);
            if (vehiculo) {
              socket.to(IdTaller).emit("newcita", {
                text:
                  "se acaba de solicitar una cita para el vehiculo " +
                  vehiculo.placa +
                  " el dia " +
                  moment(cita.fechaCita).format("DD-MM-YYYY"),
                placa: vehiculo.placa,
              });
            }
          } else {
            debug("No se encontro una cita para enviar notificacion");
          }
        });
      });

      /*socket.on("message", (message) => {
        console.log("message ::::>", message);
        socket.emit("message", message);
      });*/

      socket.on("error", (err) => {
        debug("Error message socket ::>", err.message);
        socket.disconnect();
      });
    });
  }
}
