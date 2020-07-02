const ordenAdapter = require("../adapter/ordenAdapter");
const ordenDAO = require("../dao/OrdenDAO");
const citaDAO = require("../dao/citaDAO");
const sms = require("../utils/sendSms");
const HttpStatus = require("http-status-codes");
const moment = require("moment");
const debug = require("debug")("branch:server");
const { Op } = require("sequelize");

const createOrden = (req, res, next) => {
  try {
    var orden = req.body;
    console.debug("Parametro de orden recibido :::::>", orden);

    if (orden.IdCita) {
      citaDAO.getById(orden.IdCita, (error, cita) => {
        if (error) {
          console.error(
            "Error al realizar la transaccion de crear orden:::>",
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
            let CodigoOrden = orden.CodigoOrden
              ? orden.CodigoOrden
              : moment(new Date()).format("MMDDYYYYHHMMSS") +
                cita.vehiculo.placa;
            let ordenDB = {
              //IdVehiculo: vehiculo.IdVehiculo,
              IdTaller: orden.IdTaller,
              IdEtapa: orden.IdEtapa,
              IdCita: orden.IdCita,
              IdMecanico: orden.IdMecanico,
              IdVehiculo: cita.IdVehiculo,
              kilometraje: orden.kilometraje,
              DocumentosDeja: orden.documentosDeja,
              CodigoOrden: CodigoOrden,
              Observaciones: orden.Observaciones,
              documentos: orden.documentos,
              estado: orden.estado
            };

            let textoSms = "";

            if (orden.IdEtapa == 2) {
              textoSms =
                "Su vehiculo " +
                cita.vehiculo.placa +
                " ha sido INGRESADO  en el taller BRANCH";
            }

            if (orden.IdEtapa == 3) {
              textoSms =
                "Su vehiculo " +
                cita.vehiculo.placa +
                " ha sido DIAGNOSTICADO  en el taller BRANCH";
            }

            if (orden.IdEtapa == 4) {
              textoSms =
                "Ingrese a BRANCH ya se encuentra disponible la cotización para su vehiculo " +
                cita.vehiculo.placa;
            }

            if (orden.IdEtapa == 6) {
              textoSms =
                "Se realizo la reparación de su vehiculo " +
                cita.vehiculo.placa +
                " en el taller BRANCH, ya puedes ver las fotos de tu reparación";
            }

            if (orden.IdEtapa == 7) {
              textoSms =
                "El taller BRANCH ya tiene listo su vehiculo " +
                cita.vehiculo.placa +
                " ya esta disponible la factura y puedes ir a recoger tu vehiculo";
            }

            //Envio de notificaciones
            if (cita.vehiculo.usuario.celular && textoSms != "") {
              sms.sendSMStoInfoBip(cita.vehiculo.usuario.celular, textoSms);
            }
            if (cita.vehiculo.usuario.tokenCM && textoSms != "") {
              sms.sendNotificacionToUser(
                cita.vehiculo.usuario.tokenCM,
                textoSms,
                "Citas",
                { IdCita: orden.IdCita }
              );
            }

            ordenDAO.create(ordenDB, (error, orden) => {
              if (error) {
                console.error(
                  "Error al realizar la transaccion de crear orden de trabajo:::>",
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
                if (orden) {
                  if (orden.IdEtapa) {
                    if (orden.IdEtapa == 7) {
                      cita.estado = "Finalizada";
                    } else {
                      cita.estado = "Cumplida";
                    }

                    citaDAO.update(cita.IdCita, cita, (error, cita) => {
                      if (error) {
                        console.error(
                          "Error al realizar la transaccion de actualizar cita:::>",
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
                          return res.status(HttpStatus.OK).json({ orden });
                        }
                      }
                    });
                  } else {
                    return res.status(HttpStatus.OK).json({ orden });
                  }
                } else {
                  return res
                    .status(HttpStatus.OK)
                    .json({ error: "No se creo la cita" });
                }
              }
            });
          }
        }
      });
    } else {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "El valor IdCita es requerido" });
    }
  } catch (error) {
    console.error("Error al crear orden ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateOrden = (req, res, next) => {
  try {
    var IdOrdenTrabajo = req.params.Id;
    var orden = req.body;

    console.log("Orden recibida para actualizar :::>", orden);
    if (IdOrdenTrabajo) {
      let ordenDb = {
        IdTaller: orden.IdTaller,
        CodigoOrden: orden.CodigoOrden,
        IdEtapa: orden.IdEtapa,
        IdCita: orden.IdCita,
        IdMecanico: orden.IdMecanico,
        IdVehiculo: orden.IdVehiculo,
        Observaciones: orden.Observaciones,
        estado: orden.estado
      };

      ordenDAO.update(IdOrdenTrabajo, ordenDb, function (error, orden) {
        if (error) {
          console.error(
            "Error al realizar la transaccion de actualizar orden:::>",
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
          if (orden) {
            ordenDAO.getById(IdOrdenTrabajo, (error, orden) => {
              if (error) {
                console.error(
                  "Error al realizar la transaccion de actualizar orden, getOrdenByID:::>",
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
                if (orden) {
                  debug(
                    "Datos para envio de SMS ::>",
                    orden.vehiculo.usuario.celular
                  );
                  /*if (orden.vehiculo.usuario.celular) {
                                        let textoSms = ""
                                        //Texto de cita con mecanico
                                        debug('Estado de la cita ::>', orden.estado);
                                        if(orden.estado == 'Rechazado'){
                                            sms.sendNotificacionToUser(orden.vehiculo.usuario.tokenCM,'Se confirmo su cita exitosamente')
                                        }
                                    }*/
                }
              }
            });
            return res.status(HttpStatus.ACCEPTED).json({
              message:
                "Se actualizo la orden " + IdOrdenTrabajo + " correctamente"
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
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "El parametro IdOrdenTrabajo es requerido" });
    }
  } catch (error) {
    console.error("Error al actualizar la OrdenTrabajo ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllEtapas = (req, res, next) => {
  try {
    ordenDAO.findAllEtapas(function (error, etapas) {
      if (error) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: error.errors[0] });
      } else {
        if (etapas) {
          res.status(HttpStatus.OK).json(etapas);
        }
      }
    });
  } catch (error) {
    console.error("Error al obtener etapas ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllOrdenesByIdTaller = (req, res, next) => {
  try {
    const IdTaller = req.params.Id;

    ordenDAO.findAllByFilter({ IdTaller: IdTaller }, {}, function (
      error,
      ordenes
    ) {
      if (error) {
        console.error(
          "Error al realizar la transaccion de buscar ordenes By Taller:::>",
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
        if (ordenes) {
          res.status(HttpStatus.OK).json(ordenes);
        }
      }
    });
  } catch (error) {
    console.error("Error al listar ordenes ::::> ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getOrdenById = (req, res, next) => {
  try {
    var IdOrden = req.params.Id;
    console.debug("Parametro de IdTaller recibido :::::>", req.params);
    ordenDAO.getById(IdOrden, function (error, orden) {
      if (error) {
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
        if (orden) {
          return res.status(HttpStatus.OK).json(orden);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      }
    });
  } catch (error) {
    console.error("Error al buscar Taller By Id ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllOrdenesByIdTallerAndFilter = (req, res, next) => {
  try {
    let IdTaller = req.params.Id;
    let filter = req.query.filter;

    ordenAdapter.getOrdenesByIdTallerAndFilter(
      IdTaller,
      filter,
      (error, ordenes) => {
        if (error) {
          console.error(
            "Error al realizar la transaccion de buscar ordenes By Taller:::>",
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
          if (ordenes) {
            res.status(HttpStatus.OK).json(ordenes);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al listar ordenes ::::> ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllOrdenesByIdTallerAndIdCita = (req, res, next) => {
  try {
    let IdTaller = req.params.Id;
    let IdCita = req.query.IdCita;
    console.log("IdCita buscar::>", IdCita);

    ordenAdapter.getOrdenesByIdTallerAndIdCita(
      IdTaller,
      IdCita,
      (error, ordenes) => {
        if (error) {
          console.error(
            "Error al realizar la transaccion de buscar ordenes By Taller:::>",
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
          if (ordenes) {
            res.status(HttpStatus.OK).json(ordenes);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al listar ordenes ::::> ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const countOrdenesByIdTaller = (req, res, next) => {
  try {
    var IdTaller = req.params.Id;

    ordenAdapter.countOrdenesByIdTaller(IdTaller, (error, citas) => {
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
      "Error al contar ordenes By Taller :::>",
      IdTaller,
      " Error :::>",
      error
    );
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  createOrden,
  updateOrden,
  getAllEtapas,
  getAllOrdenesByIdTaller,
  getOrdenById,
  getAllOrdenesByIdTallerAndFilter,
  getAllOrdenesByIdTallerAndIdCita,
  countOrdenesByIdTaller
};
