let citaDAO = require("../dao/citaDAO");
let vehiculoDAO = require("../dao/vehiculoDAO");
let mecanicoDAO = require("../dao/mecanicoDAO");
let sms = require("../utils/sendSms");
let HttpStatus = require("http-status-codes");
let moment = require("moment");
let debug = require("debug")("branch:server");
const { Op } = require("sequelize");

moment.locale("es");

const getAllCitas = (req, res, next) => {
  try {
    citaDAO.findAll(function (error, citas) {
      if (error) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: error.errors[0] });
      } else {
        if (citas) {
          res.status(HttpStatus.OK).json(citas);
        }
      }
    });
  } catch (error) {
    console.error("Error al obtener cita ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const createCita = (req, res, next) => {
  try {
    var cita = req.body;
    console.debug("Parametro de cita recibido :::::>", cita);

    vehiculoDAO.findOneByFilter(
      { placa: cita.placa, IdTaller: cita.taller },
      function (error, vehiculo) {
        if (error) {
          console.error(
            "Error al realizar la transaccion de buscar vehiculo por placa:::>",
            "error ::>",
            error
          );
          if (error.errors) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        } else {
          if (vehiculo) {
            var citaDb = {
              IdVehiculo: vehiculo.IdVehiculo,
              IdTaller: cita.taller,
              IdMecanico: cita.mecanico,
              fechaCita: moment(cita.fechaCita, "DD/MM/YYYY"),
              horaCita: cita.horaCita,
              servicio: cita.servicio,
              estado: cita.estado,
            };
            console.log("Cita a persistir en la BD", citaDb);
            citaDAO.create(citaDb, function (error, cita) {
              if (error) {
                console.error(
                  "Error al realizar la transaccion de crear cita:::>",
                  "error ::>",
                  error
                );
                if (error.errors) {
                  return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ error: error.errors[0] });
                } else {
                  return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ error: error.message });
                }
              } else {
                if (cita) {
                  if (vehiculo.usuario.celular) {
                    let textoSms = "";
                    debug(
                      " Mecanico a buscar para envio de SMS con Mecancio ::>",
                      cita.IdMecanico
                    );
                    mecanicoDAO.getById(cita.IdMecanico, (error, mecanico) => {
                      if (error) {
                        console.error(
                          "Error al buscar mecanico para SMS de la cita, error ::>",
                          error
                        );
                      } else {
                        if (mecanico) {
                          //Texto de cita con mecanico
                          textoSms =
                            "Hola " +
                            vehiculo.usuario.firstName +
                            "! Te esperamos el " +
                            moment(cita.fechaCita).format("D [de] MMMM YYYY") +
                            " a las " +
                            cita.horaCita +
                            " con tu " +
                            vehiculo.tipoVehiculo +
                            "  " +
                            vehiculo.placa +
                            ", " +
                            mecanico.firstName +
                            " de BRANCH tendra el gusto de recibirte. Tu experiencia nuestro motor! BRANCH";
                          sms.sendSMSTwilio(vehiculo.usuario.celular, textoSms);
                          sms.sendNotificacionToUser(
                            vehiculo.usuario.tokenCM,
                            textoSms
                          );
                        } else {
                          //Texto de cita sin mecanico
                          textoSms =
                            "Hola " +
                            vehiculo.usuario.firstName +
                            "! Te esperamos el " +
                            moment(cita.fechaCita).format("D [de] MMMM YYYY") +
                            " a las " +
                            cita.horaCita +
                            " con tu " +
                            vehiculo.tipoVehiculo +
                            "  " +
                            vehiculo.placa +
                            ", BRANCH tendra el gusto de recibirte. Tu experiencia nuestro motor! BRANCH";
                          sms.sendSMSTwilio(vehiculo.usuario.celular, textoSms);
                          sms.sendNotificacionToUser(
                            vehiculo.usuario.tokenCM,
                            textoSms
                          );
                        }
                      }
                    });
                  }
                  return res.status(HttpStatus.OK).json(cita);
                } else {
                  return res
                    .status(HttpStatus.OK)
                    .json({ error: "No se creo la cita" });
                }
              }
            });
          } else {
            return res
              .status(HttpStatus.PRECONDITION_REQUIRED)
              .send({
                error: "No se encontro un vehiculo con la placa " + cita.placa,
              });
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al crear cita ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateCita = (req, res, next) => {
  try {
    var IdCita = req.params.Id;
    var cita = req.body;
    if (IdCita) {
      debug("Hora actual cita ::>", moment(cita.horaCita, "hh:mm:ss"));
      debug("Fecha Today -1 ::>", moment().add(1, "day"));

      let momentHour = moment(cita.horaCita, "hh:mm:ss");
      let fechaCita = moment(cita.fechaCita, "DD/MM/YYYY")
        .hour(momentHour.hour())
        .minute(momentHour.minute());

      debug("Fecha actual cita :::>", fechaCita);
      debug(
        "Comparacion de cita ::>",
        fechaCita >= moment().subtract(1, "day")
      );

      let citaDb = {
        IdTaller: cita.taller,
        IdMecanico: cita.mecanico,
        fechaCita: moment(cita.fechaCita, "DD/MM/YYYY"),
        horaCita: cita.horaCita,
        servicio: cita.servicio,
        estado: cita.estado,
      };

      if (
        cita.estado != "Cancelada" ||
        (cita.estado == "Cancelada" && fechaCita >= moment().add(1, "day"))
      ) {
        citaDAO.update(IdCita, citaDb, function (error, cita) {
          if (error) {
            console.error(
              "Error al realizar la transaccion de actualizar cita:::>",
              "error ::>",
              error.message
            );
            if (error.errors) {
              return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: error.errors[0] });
            } else {
              return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: error.message });
            }
          } else {
            if (cita) {
              citaDAO.getById(IdCita, (error, cita) => {
                if (error) {
                  console.error(
                    "Error al realizar la transaccion de actualizar cita:::>",
                    "error ::>",
                    error.message
                  );
                  if (error.errors) {
                    return res
                      .status(HttpStatus.INTERNAL_SERVER_ERROR)
                      .json({ error: error.errors[0] });
                  } else {
                    return res
                      .status(HttpStatus.INTERNAL_SERVER_ERROR)
                      .json({ error: error.message });
                  }
                } else {
                  if (cita) {
                    debug(
                      "Datos para envio de SMS ::>",
                      cita.vehiculo.usuario.celular
                    );
                    if (cita.vehiculo.usuario.celular) {
                      let textoSms = "";
                      //Texto de cita con mecanico
                      debug("Estado de la cita ::>", cita.estado);
                      if (cita.estado == "Confirmada") {
                        sms.sendNotificacionToUser(
                          cita.vehiculo.usuario.tokenCM,
                          "Se confirmo su cita exitosamente"
                        );
                      } else {
                        if (cita.estado == "Cancelada") {
                          textoSms =
                            "Hola " +
                            cita.vehiculo.usuario.firstName +
                            "! Se cancelo la cita que tenias el " +
                            moment(cita.fechaCita).format("D [de] MMMM YYYY") +
                            " a las " +
                            cita.horaCita +
                            " con tu " +
                            cita.vehiculo.tipoVehiculo +
                            "  " +
                            cita.vehiculo.placa +
                            ", BRANCH tendra el gusto de recibirte en una proxima oportunidad. Tu experiencia nuestro motor! BRANCH";
                          sms.sendSMSTwilio(
                            cita.vehiculo.usuario.celular,
                            textoSms
                          );
                          sms.sendNotificacionToUser(
                            cita.vehiculo.usuario.tokenCM,
                            textoSms
                          );
                        } else {
                          if (cita.estado == "Incumplida") {
                            textoSms =
                              "Hola " +
                              cita.vehiculo.usuario.firstName +
                              "! Incumpliste la cita que tenias el " +
                              moment(cita.fechaCita).format(
                                "D [de] MMMM YYYY"
                              ) +
                              " a las " +
                              cita.horaCita +
                              " con tu " +
                              cita.vehiculo.tipoVehiculo +
                              "  " +
                              cita.vehiculo.placa +
                              ", esto afectara tu puntuacion en nuestra plataforma. BRANCH tendra el gusto de recibirte en una proxima oportunidad. Tu experiencia nuestro motor! BRANCH";
                            sms.sendSMSTwilio(
                              cita.vehiculo.usuario.celular,
                              textoSms
                            );
                          } else {
                            textoSms =
                              "Hola " +
                              cita.vehiculo.usuario.firstName +
                              "! Su cita quedo asignada el " +
                              moment(cita.fechaCita).format(
                                "D [de] MMMM YYYY"
                              ) +
                              " a las " +
                              cita.horaCita +
                              " con tu " +
                              cita.vehiculo.tipoVehiculo +
                              "  " +
                              cita.vehiculo.placa +
                              ", " +
                              cita.mecanico.firstName +
                              " de BRANCH tendra el gusto de recibirte. Tu experiencia nuestro motor! BRANCH";
                            sms.sendSMSTwilio(
                              cita.vehiculo.usuario.celular,
                              textoSms
                            );
                          }
                        }
                      }
                    }
                  }
                }
              });
              return res
                .status(HttpStatus.ACCEPTED)
                .json({
                  message: "Se actualizo la cita " + IdCita + " correctamente",
                });
            } else {
              return res
                .status(HttpStatus.OK)
                .json({ error: "No se actualizo la cita" });
            }
          }
        });
      } else {
        return res
          .status(HttpStatus.EXPECTATION_FAILED)
          .json({
            error: "Solo se puede cancelar una cita hasta 24 horas antes.",
          });
      }
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "El parametro IdCita es requerido" });
    }
  } catch (error) {
    console.error("Error al actualizar la cita ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteCitaById = (req, res, next) => {
  try {
    var IdCita = req.params.Id;
    console.debug("Parametro de IdCita recibido :::::>", IdCita);
    citaDAO.deleteById(IdCita, function (error, result) {
      if (error) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.errors[0] });
      } else {
        if (result) {
          return res
            .status(HttpStatus.ACCEPTED)
            .json({
              message: "Se elimino la IdCita " + IdCita + " correctamente",
            });
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ message: "Id no encontrado" });
        }
      }
    });
  } catch (error) {
    console.error("Error al borrar Cita By Id ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const findCitaById = (req, res, next) => {
  try {
    var IdCita = req.params.Id;
    //console.debug('Parametro de Idusuario recibido :::::>', req.params);
    citaDAO.getById(IdCita, function (error, cita) {
      if (error) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.errors[0] });
      } else {
        if (cita) {
          return res.status(HttpStatus.OK).json(cita);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      }
    });
  } catch (error) {
    console.error("Error al buscar Cita By Id ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllCitasByIdTaller = (req, res, next) => {
  try {
    var IdTaller = req.params.Id;

    citaDAO.findAllByFilter(
      { IdTaller: IdTaller, estado: { [Op.ne]: "Cancelada" } },
      {},
      {},
      function (error, citas) {
        if (error) {
          console.error(
            "Error al realizar la transaccion de buscar citas por Taller error ::>",
            error.message
          );
          if (error.errors) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        } else {
          if (citas) {
            var events = castCitasToEvents(citas);
            res.status(HttpStatus.OK).json(events);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al listar citas ::::> ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllCitasByIdUsuario = (req, res, next) => {
  try {
    var IdUsuario = req.params.Id;

    citaDAO.findAllByFilter({}, { IdUsuario: IdUsuario }, {}, function (
      error,
      citas
    ) {
      if (error) {
        console.error(
          "Error al realizar la transaccion de buscar citas By Usuario error ::>",
          error.message
        );
        if (error.errors) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.errors[0] });
        } else {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      } else {
        if (citas) {
          res.status(HttpStatus.OK).json(citas);
        }
      }
    });
  } catch (error) {
    console.error("Error al listar citas ::::> ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllCitasPasadasByIdUsuario = (req, res, next) => {
  try {
    var IdUsuario = req.params.Id;

    citaDAO.findAllByFilter(
      {
        [Op.or]: [
          { estado: "Cancelada" },
          { estado: "Incumplida" },
          { estado: "Finalizada" },
        ],
      },
      { IdUsuario: IdUsuario },
      {},
      function (error, citas) {
        if (error) {
          console.error(
            "Error al realizar la transaccion de buscar citas By Usuario error ::>",
            error.message
          );
          if (error.errors) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        } else {
          if (citas) {
            res.status(HttpStatus.OK).json(citas);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al listar citas ::::> ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllCitasActivasByIdUsuario = (req, res, next) => {
  try {
    var IdUsuario = req.params.Id;

    citaDAO.findAllByFilter(
      { estado: "Cumplida" },
      { IdUsuario: IdUsuario },
      { [Op.or]: [{ estado: "Aceptado" }, { estado: "Pendiente" }] },
      function (error, citas) {
        if (error) {
          console.error(
            "Error al realizar la transaccion de buscar citas By Usuario error ::>",
            error.message
          );
          if (error.errors) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        } else {
          if (citas) {
            res.status(HttpStatus.OK).json(citas);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al listar citas ::::> ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllCitasFuturasByIdUsuario = (req, res, next) => {
  try {
    var IdUsuario = req.params.Id;

    citaDAO.findAllByFilter(
      {
        [Op.or]: [{ estado: "Solicitada" }, { estado: "Confirmada" }],
        fechaCita: { [Op.gte]: new Date() },
      },
      { IdUsuario: IdUsuario },
      { IdOrdenTrabajo: { [Op.is]: null } },
      function (error, citas) {
        if (error) {
          console.error(
            "Error al realizar la transaccion de buscar citas By Usuario error ::>",
            error.message
          );
          if (error.errors) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.errors[0] });
          } else {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error.message });
          }
        } else {
          if (citas) {
            res.status(HttpStatus.OK).json(citas);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al listar citas ::::> ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const castCitasToEvents = (citas) => {
  let events = [];
  citas.forEach((cita) => {
    var dataCita = cita.dataValues;
    let hour = 0;
    if (cita.dataValues.horaCita) {
      hour = moment(cita.dataValues.horaCita, "HH:mm:ss");
    } else {
      hour = moment("00:00:00", "HH:mm:ss");
    }

    let myDate = new Date(
      Date.UTC(
        dataCita.fechaCita.getFullYear(),
        dataCita.fechaCita.getMonth(),
        dataCita.fechaCita.getDate(),
        hour.hour(),
        hour.minute(),
        0
      )
    );

    let classEstado = (estado) => {
      switch (estado) {
        case "Solicitada":
          return "event-solicitado";
        case "Confirmada":
          return "event-confirmada";
        case "Cumplida":
          return "event-cumplida";
        case "Cancelada":
          return "event-cancelada";
        case "Incumplida":
          return "event-incumplida";
        default:
          "event-default";
      }
    };

    let event = {
      id: dataCita.IdCita,
      startDate: myDate,
      title: "Cita vehiculo =>" + dataCita.vehiculo.placa,
      classes: classEstado(dataCita.estado),
      citaObject: dataCita,
      estado: dataCita.estado,
    };
    events.push(event);
  });
  return events;
};

module.exports = {
  getAllCitas,
  createCita,
  updateCita,
  deleteCitaById,
  findCitaById,
  getAllCitasByIdTaller,
  getAllCitasByIdUsuario,
  getAllCitasPasadasByIdUsuario,
  getAllCitasActivasByIdUsuario,
  getAllCitasFuturasByIdUsuario,
};
