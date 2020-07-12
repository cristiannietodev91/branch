const citaAdapter = require("../adapter/citaAdapter");
const notificacionAdapter = require("../adapter/notificacionAdapter");
const citaDAO = require("../dao/citaDAO");
const vehiculoDAO = require("../dao/vehiculoDAO");
const mecanicoDAO = require("../dao/mecanicoDAO");
const sms = require("../utils/sendSms");
const HttpStatus = require("http-status-codes");
const moment = require("moment");
const debug = require("debug")("branch:server");
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
              estado: cita.estado
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
                      }
                      if (vehiculo.usuario.celular) {
                        sms.sendSMStoInfoBip(
                          vehiculo.usuario.celular,
                          textoSms
                        );
                      }
                      if (vehiculo.usuario.tokenCM) {
                        sms.sendNotificacionToUser(
                          vehiculo.usuario.tokenCM,
                          textoSms
                        );
                      }
                      const notificacion = {
                        IdUsuario: vehiculo.usuario.uid,
                        text: textoSms,
                        typenotificacion: "Cita",
                        read: false,
                        dataAdicional: { IdCita: cita.IdCita, calificada: true }
                      };
                      notificacionAdapter.crearNotificacion(
                        notificacion,
                        (error) => {
                          if (error) {
                            console.error("Notificacion error :::>", error);
                          } else {
                            if (vehiculo.usuario.tokenCM) {
                              sms.sendDataToUser(
                                vehiculo.usuario.tokenCM,
                                "notificacion",
                                { IdCita: cita.IdCita }
                              );
                            }

                            console.log(
                              "Se creo la notificacion correctamente :::>",
                              error
                            );
                          }
                        }
                      );
                    }
                  });
                  // Si la cita es solicitada se notifica al taller que el cliente solicito una cita

                  return res.status(HttpStatus.OK).json(cita);
                } else {
                  return res
                    .status(HttpStatus.OK)
                    .json({ error: "No se creo la cita" });
                }
              }
            });
          } else {
            return res.status(HttpStatus.PRECONDITION_REQUIRED).send({
              error: "No se encontro un vehiculo con la placa " + cita.placa
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
    const IdCita = req.params.Id;
    const cita = req.body;
    citaAdapter.updateCitaByIdCita(IdCita, cita, (error, cita) => {
      if (error) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      } else {
        if (cita) {
          return res.status(HttpStatus.ACCEPTED).json({
            message: "Se actualizo la cita " + IdCita + " correctamente"
          });
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ error: "No se actualizo la cita" });
        }
      }
    });
  } catch (error) {
    console.error("Error al actualizar la cita ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const calificaCita = (req, res, next) => {
  try {
    const IdCita = req.params.Id;
    const { calificacion, calificacionUsuario } = req.body;
    citaAdapter.calificaCitaByIdCita(
      IdCita,
      calificacion,
      calificacionUsuario,
      (error, cita) => {
        if (error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        } else {
          if (cita) {
            return res.status(HttpStatus.ACCEPTED).json({
              message: "Se califico la cita " + IdCita + " correctamente"
            });
          } else {
            return res
              .status(HttpStatus.OK)
              .json({ error: "No se actualizo la cita" });
          }
        }
      }
    );
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
          return res.status(HttpStatus.ACCEPTED).json({
            message: "Se elimino la IdCita " + IdCita + " correctamente"
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
    citaAdapter.findCitaByIdCita(IdCita, (error, cita) => {
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

    citaAdapter.getAllCitasByIdTaller(IdTaller, (error, citas) => {
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
    });
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
    citaAdapter.getAllCitasByIdUsuario(IdUsuario, (error, citas) => {
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

    citaAdapter.getAllCitasPasadasByIdUsuario(IdUsuario, (error, citas) => {
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

const getAllCitasActivasByIdUsuario = (req, res, next) => {
  try {
    var IdUsuario = req.params.Id;

    citaAdapter.getAllCitasActivasByIdUsuario(IdUsuario, (error, citas) => {
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

const getAllCitasFuturasByIdUsuario = (req, res, next) => {
  try {
    var IdUsuario = req.params.Id;

    citaAdapter.getAllCitasFuturasByIdUsuario(IdUsuario, (error, citas) => {
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

const countCitasByIdTaller = (req, res, next) => {
  try {
    var IdTaller = req.params.Id;

    citaAdapter.countCitasByIdTaller(IdTaller, (error, citas) => {
      if (error) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error });
      } else {
        if (citas) {
          return res.status(HttpStatus.OK).json(citas);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      }
    });
  } catch (error) {
    console.error(
      "Error al contar Citas By Taller :::>",
      IdTaller,
      " Error :::>",
      error
    );
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const countCitasByEstadoIdTaller = (req, res, next) => {
  try {
    var IdTaller = req.params.Id;

    citaAdapter.countCitasByEstadoIdTaller(IdTaller, (error, citas) => {
      if (error) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error });
      } else {
        if (citas) {
          return res.status(HttpStatus.OK).json(citas);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      }
    });
  } catch (error) {
    console.error(
      "Error al contar Citas By Taller :::>",
      IdTaller,
      " Error :::>",
      error
    );
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const countCitasByDateAndIdTaller = (req, res, next) => {
  try {
    var IdTaller = req.params.Id;

    citaAdapter.countCitasByDateAndIdTaller(IdTaller, (error, citas) => {
      if (error) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error });
      } else {
        if (citas) {
          return res.status(HttpStatus.OK).json(citas);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      }
    });
  } catch (error) {
    console.error(
      "Error al contar Citas By Taller :::>",
      IdTaller,
      " Error :::>",
      error
    );
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllCitasByfilter = (req, res, next) => {
  try {
    let IdTaller = req.params.Id;
    let filter = req.body.value;

    citaDAO.findAllByFilter(
      { IdTaller: IdTaller, estado: { [Op.ne]: "Cancelada" } },
      {},
      { CodigoOrden: filter },
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
      estado: dataCita.estado
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
  getAllCitasByfilter,
  countCitasByIdTaller,
  countCitasByEstadoIdTaller,
  countCitasByDateAndIdTaller,
  calificaCita
};
