const citaDAO = require("../dao/citaDAO");
const notificacionAdapter = require("../adapter/notificacionAdapter");
const { Op, Sequelize } = require("sequelize");
const sms = require("../utils/sendSms");
const moment = require("moment");
/**
 *
 * @param {*} IdCita
 * @param {*} cb
 */
const findCitaByIdCita = (IdCita, cb) => {
  citaDAO.getById(IdCita, function (error, cita) {
    if (error) {
      cb(error, null);
    } else {
      if (cita) {
        cb(null, cita);
      } else {
        cb(null, null);
      }
    }
  });
};

/**
 *
 * @param {*} filterCita
 * @param {*} filtervehiculo
 * @param {*} filterOrden
 * @param {*} cb
 */
const findCitaByFilter = (filterCita, filtervehiculo, filterOrden, cb) => {
  citaDAO.findAllByFilter(filterCita, filtervehiculo, filterOrden, function (
    error,
    citas
  ) {
    if (error) {
      cb(error, null);
    } else {
      if (citas) {
        cb(null, citas);
      }
    }
  });
};

const updateCitaByIdCita = (IdCita, cita, cb) => {
  if (IdCita) {
    let momentHour = moment(cita.horaCita, "hh:mm:ss");
    let fechaCita = moment(cita.fechaCita, "DD/MM/YYYY")
      .hour(momentHour.hour())
      .minute(momentHour.minute());

    let citaDb = {
      IdTaller: cita.taller,
      IdMecanico: cita.mecanico,
      fechaCita: cita.fechaCita
        ? moment(cita.fechaCita, "DD/MM/YYYY")
        : cita.fechaCita,
      horaCita: cita.horaCita,
      servicio: cita.servicio,
      estado: cita.estado,
      calificacion: cita.calificacion,
      calificacionUsuario: cita.calificacionUsuario
    };

    console.log("CitaDB :::>", citaDb);

    if (
      cita.estado != "Cancelada" ||
      (cita.estado == "Cancelada" && fechaCita >= moment().add(1, "day"))
    ) {
      citaDAO.update(IdCita, citaDb, function (error, cita) {
        if (error) {
          cb(error, null);
        } else {
          if (cita) {
            citaDAO.getById(IdCita, (error, cita) => {
              if (error) {
                cb(error, null);
              } else {
                if (cita) {
                  let textoSms = "";
                  //Texto de cita con mecanico

                  if (cita.estado == "Confirmada") {
                    textoSms = "Se confirmo su cita exitosamente";
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
                    } else {
                      if (cita.estado == "Incumplida") {
                        textoSms =
                          "Hola " +
                          cita.vehiculo.usuario.firstName +
                          "! Incumpliste la cita que tenias el " +
                          moment(cita.fechaCita).format("D [de] MMMM YYYY") +
                          " a las " +
                          cita.horaCita +
                          " con tu " +
                          cita.vehiculo.tipoVehiculo +
                          "  " +
                          cita.vehiculo.placa +
                          ", esto afectara tu puntuacion en nuestra plataforma. BRANCH tendra el gusto de recibirte en una proxima oportunidad. Tu experiencia nuestro motor! BRANCH";
                      } else {
                        textoSms =
                          "Hola " +
                          cita.vehiculo.usuario.firstName +
                          "! Su cita quedo asignada el " +
                          moment(cita.fechaCita).format("D [de] MMMM YYYY") +
                          " a las " +
                          cita.horaCita +
                          " con tu " +
                          cita.vehiculo.tipoVehiculo +
                          "  " +
                          cita.vehiculo.placa +
                          ", " +
                          cita.mecanico.firstName +
                          " de BRANCH tendra el gusto de recibirte. Tu experiencia nuestro motor! BRANCH";
                      }
                    }
                  }
                  if (cita.vehiculo.usuario.celular) {
                    sms.sendSMStoInfoBip(
                      cita.vehiculo.usuario.celular,
                      textoSms
                    );
                  }
                  if (cita.vehiculo.usuario.tokenCM) {
                    sms.sendNotificacionToUser(
                      cita.vehiculo.usuario.tokenCM,
                      textoSms
                    );
                  }
                  // Persistir notificacion
                  const notificacion = {
                    IdUsuario: cita.vehiculo.usuario.uid,
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
                        if (cita.vehiculo.usuario.tokenCM) {
                          sms.sendDataToUser(
                            cita.vehiculo.usuario.tokenCM,
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
              }
            });
            cb(null, cita);
          } else {
            cb(null, null);
          }
        }
      });
    } else {
      cb(
        {
          message: "Solo se puede cancelar una cita hasta 24 horas antes."
        },
        null
      );
    }
  } else {
    cb(
      {
        message: "El parametro IdCita es requerido"
      },
      null
    );
  }
};

const calificaCitaByIdCita = (
  IdCita,
  calificacion,
  calificacionUsuario,
  cb
) => {
  if (IdCita) {
    let citaDb = {
      calificacion: calificacion,
      calificacionUsuario: calificacionUsuario
    };

    citaDAO.update(IdCita, citaDb, function (error, cita) {
      if (error) {
        cb(error, null);
      } else {
        if (cita) {
          citaDAO.getById(IdCita, (error, cita) => {
            if (error) {
              cb(error, null);
            } else {
              if (cita) {
                cb(null, cita);
              }
            }
          });
        } else {
          cb(null, null);
        }
      }
    });
  } else {
    cb(
      {
        message: "El parametro IdCita es requerido"
      },
      null
    );
  }
};

/**
 *
 * @param {*} IdTaller
 */
const getAllCitasByIdTaller = (IdTaller, cb) => {
  citaDAO.findAllByFilter(
    { IdTaller: IdTaller, estado: { [Op.ne]: "Cancelada" } },
    {},
    {},
    function (error, citas) {
      if (error) {
        cb(error, null);
      } else {
        if (citas) {
          cb(null, citas);
        }
      }
    }
  );
};

/**
 *
 * @param {*} IdUsuario
 */
const getAllCitasByIdUsuario = (IdUsuario, cb) => {
  citaDAO.findAllByFilter({}, { IdUsuario: IdUsuario }, {}, (error, citas) => {
    if (error) {
      cb(error, null);
    } else {
      if (citas) {
        cb(null, citas);
      }
    }
  });
};

/**
 *
 * @param {*} IdUsuario
 */
const getAllCitasPasadasByIdUsuario = (IdUsuario, cb) => {
  citaDAO.findAllByFilter(
    {
      [Op.or]: [
        { estado: "Cancelada" },
        { estado: "Incumplida" },
        { estado: "Finalizada" }
      ]
    },
    { IdUsuario: IdUsuario },
    {},
    (error, citas) => {
      if (error) {
        cb(error, null);
      } else {
        if (citas) {
          cb(null, citas);
        }
      }
    }
  );
};

/**
 *
 * @param {*} IdUsuario
 */
const getAllCitasFuturasByIdUsuario = (IdUsuario, cb) => {
  citaDAO.findAllByFilter(
    {
      [Op.or]: [{ estado: "Solicitada" }, { estado: "Confirmada" }],
      fechaCita: { [Op.gte]: new Date() }
    },
    { IdUsuario: IdUsuario },
    { IdOrdenTrabajo: { [Op.is]: null } },
    (error, citas) => {
      if (error) {
        cb(error, null);
      } else {
        if (citas) {
          cb(null, citas);
        }
      }
    }
  );
};

/**
 *
 * @param {*} IdUsuario
 * @param {*} cb
 */
const getAllCitasActivasByIdUsuario = (IdUsuario, cb) => {
  citaDAO.findAllByFilter(
    { estado: "Cumplida" },
    { IdUsuario: IdUsuario },
    { [Op.or]: [{ estado: "Aceptado" }, { estado: "Pendiente" }] },
    (error, citas) => {
      if (error) {
        cb(error, null);
      } else {
        if (citas) {
          cb(null, citas);
        }
      }
    }
  );
};

const countCitasByIdTaller = (IdTaller, cb) => {
  citaDAO.count({ IdTaller: IdTaller }, null, null, (error, result) => {
    if (error) {
      cb(error, null);
    } else {
      cb(null, result);
    }
  });
};

const countCitasByEstadoIdTaller = (IdTaller, cb) => {
  citaDAO.count(
    { IdTaller: IdTaller },
    ["estado"],
    ["estado"],
    (error, result) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};

const countCitasByDateAndIdTaller = (IdTaller, cb) => {
  citaDAO.count(
    { IdTaller: IdTaller },
    ["date"],
    [[Sequelize.literal(`DATE(createdAt)`), "date"]],
    (error, result) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};

module.exports = {
  findCitaByIdCita,
  findCitaByFilter,
  updateCitaByIdCita,
  getAllCitasByIdTaller,
  getAllCitasByIdUsuario,
  getAllCitasPasadasByIdUsuario,
  getAllCitasFuturasByIdUsuario,
  getAllCitasActivasByIdUsuario,
  countCitasByIdTaller,
  countCitasByEstadoIdTaller,
  countCitasByDateAndIdTaller,
  calificaCitaByIdCita
};
