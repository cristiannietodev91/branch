import ordenAdapter from "../adapter/ordenAdapter";
import notificacionAdapter from "../adapter/notificacionAdapter";
import ordenDAO from "../dao/ordenDAO";
import citaDAO from "../dao/citaDAO";
import {
  sendSMStoInfoBip,
  sendNotificacionToUser,
  sendDataToUser,
} from "../utils/sendSms";
import HttpStatus from "http-status-codes";
import moment from "moment";
import Debug from "debug";
import { Request, Response } from "express";
import citaAdapter from "../adapter/citaAdapter";
import { CitaCreationAttributes, OrdenCreationAttributes } from "../types";
const debug = Debug("branch:server");

const createOrden = (req: Request, res: Response) => {
  try {
    const orden = req.body;
    debug("Parametro de orden recibido :::::>", orden);

    if (orden.IdCita) {
      citaAdapter
        .findCitaByIdCita(orden.IdCita)
        ?.then((cita) => {
          if (cita) {
            const CodigoOrden = orden.CodigoOrden
              ? orden.CodigoOrden
              : moment(new Date()).format("MMDDYYYYHHMMSS") +
                cita.vehiculo?.placa;
            const ordenDB: OrdenCreationAttributes = {
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
              estado: orden.estado,
            };

            let textoSms = "";

            if (orden.IdEtapa == 2) {
              textoSms =
                "Su vehiculo " +
                cita.vehiculo?.placa +
                " ha sido INGRESADO  en el taller BRANCH";
            }

            if (orden.IdEtapa == 3) {
              textoSms =
                "Su vehiculo " +
                cita.vehiculo?.placa +
                " ha sido DIAGNOSTICADO  en el taller BRANCH";
            }

            if (orden.IdEtapa == 4) {
              textoSms =
                "Ingrese a BRANCH ya se encuentra disponible la cotización para su vehiculo " +
                cita.vehiculo?.placa;
            }

            if (orden.IdEtapa == 6) {
              textoSms =
                "Se realizo la reparación de su vehiculo " +
                cita.vehiculo?.placa +
                " en el taller BRANCH, ya puedes ver las fotos de tu reparación";
            }

            if (orden.IdEtapa == 7) {
              textoSms =
                "El taller BRANCH ya tiene listo su vehiculo " +
                cita.vehiculo?.placa +
                " ya esta disponible la factura y puedes ir a recoger tu vehiculo";
            }

            //Envio de notificaciones
            if (cita.vehiculo?.usuarios?.celular && textoSms != "") {
              sendSMStoInfoBip(cita.vehiculo.usuarios?.celular, textoSms);
            }
            if (cita.vehiculo?.usuarios?.tokenCM && textoSms != "") {
              sendNotificacionToUser(
                cita.vehiculo.usuarios?.tokenCM,
                textoSms,
                "Citas",
                { IdCita: orden.IdCita }
              );
            }

            const calificada = orden.IdEtapa !== 7;
            if (textoSms != "") {
              if (cita.vehiculo && cita.vehiculo.usuarios) {
                const notificacion = {
                  IdUsuario: cita.vehiculo.usuarios.uid ?? "",
                  text: textoSms,
                  typenotificacion:
                    orden.IdEtapa === 7 ? "Calificación" : "Orden",
                  read: false,
                  dataAdicional: {
                    IdCita: cita.IdCita,
                    calificada: calificada,
                  },
                };
                notificacionAdapter
                  .crearNotificacion(notificacion)
                  ?.then(() => {
                    if (cita.vehiculo?.usuarios?.tokenCM) {
                      sendDataToUser(
                        cita.vehiculo.usuarios?.tokenCM,
                        "notificacion",
                        { IdCita: cita.IdCita }
                      );
                    }

                    debug("Se creo la notificacion correctamente :::>");
                  })
                  .catch((error) => {
                    return res
                      .status(HttpStatus.INTERNAL_SERVER_ERROR)
                      .json({ error: error.message });
                  });
              }

              ordenDAO
                .create(ordenDB)
                ?.then((orden) => {
                  if (orden) {
                    if (orden.IdEtapa) {
                      const citaToUpdate: Partial<CitaCreationAttributes> = {
                        estado: "Cumplida",
                      };

                      if (orden.IdEtapa == 7) {
                        citaToUpdate.estado = "Finalizada";
                      }

                      citaDAO
                        .update(cita.IdCita, citaToUpdate)
                        ?.then((cita) => {
                          if (cita) {
                            return res.status(HttpStatus.OK).json({ orden });
                          }
                        })
                        .catch((error) => {
                          return res
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .json({ error: error.message });
                        });
                    } else {
                      return res.status(HttpStatus.OK).json({ orden });
                    }
                  } else {
                    return res
                      .status(HttpStatus.OK)
                      .json({ error: "No se creo la cita" });
                  }
                })
                .catch((error) => {
                  return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ error: error.message });
                });
            }
          }
        })
        .catch((error) => {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        });
    } else {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "El valor IdCita es requerido" });
    }
  } catch (error) {
    console.error("Error al crear orden ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const updateOrden = (req: Request, res: Response) => {
  try {
    const IdOrdenTrabajo = req.params.Id;
    const orden = req.body;

    debug("Orden recibida para actualizar :::>", orden);
    if (IdOrdenTrabajo) {
      let ordenDb = {
        IdTaller: orden.IdTaller,
        CodigoOrden: orden.CodigoOrden,
        IdEtapa: orden.IdEtapa,
        IdCita: orden.IdCita,
        IdMecanico: orden.IdMecanico,
        IdVehiculo: orden.IdVehiculo,
        Observaciones: orden.Observaciones,
        estado: orden.estado,
      };

      ordenDAO
        .update({ IdOrdenTrabajo }, ordenDb)
        ?.then((orden) => {
          if (orden) {
            ordenDAO
              .getById(IdOrdenTrabajo)
              ?.then((orden) => {
                /*if (orden) {
              debug(
                "Datos para envio de SMS ::>",
                orden.vehiculo?.usuario.celular
              );
            }*/
              })
              .catch((error) => {
                return res
                  .status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({ error: error.message });
              });
            return res.status(HttpStatus.ACCEPTED).json({
              message:
                "Se actualizo la orden " + IdOrdenTrabajo + " correctamente",
            });
          } else {
            return res
              .status(HttpStatus.OK)
              .json({ error: "No se actualizo la cita" });
          }
        })
        .catch((error) => {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        });
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "El parametro IdOrdenTrabajo es requerido" });
    }
  } catch (error) {
    console.error("Error al actualizar la OrdenTrabajo ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

/*const getAllEtapas = (req: Request, res: Response) => {
  try {
    ordenAdapter.findAllEtapas().function (error, etapas) {
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
};*/

const getAllOrdenesByIdTaller = (req: Request, res: Response) => {
  try {
    const IdTaller = req.params.Id;

    ordenDAO
      .findAllByFilter({ IdTaller: IdTaller }, {}, {})
      ?.then((ordenes) => {
        if (ordenes) {
          res.status(HttpStatus.OK).json(ordenes);
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al listar ordenes ::::> ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getOrdenById = (req: Request, res: Response) => {
  try {
    const IdOrden = req.params.Id;
    debug("Parametro de IdTaller recibido :::::>", req.params);
    ordenDAO
      .getById(IdOrden)
      ?.then((orden) => {
        if (orden) {
          return res.status(HttpStatus.OK).json(orden);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al buscar Taller By Id ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllOrdenesByIdTallerAndFilter = (req: Request, res: Response) => {
  try {
    const IdTaller = req.params.Id;
    const filter = req.query.filter;

    if (filter) {
      ordenAdapter
        .getOrdenesByIdTallerAndFilter(IdTaller)
        ?.then((ordenes) => {
          if (ordenes) {
            res.status(HttpStatus.OK).json(ordenes);
          }
        })
        .catch((error) => {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        });
    } else {
      ordenAdapter
        .getOrdenesByIdTallerActivas(IdTaller)
        ?.then((ordenes) => {
          if (ordenes) {
            res.status(HttpStatus.OK).json(ordenes);
          }
        })
        .catch((error) => {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        });
    }
  } catch (error) {
    console.error("Error al listar ordenes ::::> ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllOrdenesByIdTallerAndIdCita = (req: Request, res: Response) => {
  try {
    const IdTaller = req.params.Id;
    //const IdCita = req.query.IdCita;
    //TODO: send IdCita param
    //debug("IdCita buscar::>", IdCita);

    ordenAdapter
      .getOrdenesByIdTallerAndIdCita(IdTaller)
      ?.then((ordenes) => {
        if (ordenes) {
          res.status(HttpStatus.OK).json(ordenes);
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al listar ordenes ::::> ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const countOrdenesByIdTaller = (req: Request, res: Response) => {
  try {
    const IdTaller = req.params.Id;

    ordenAdapter
      .countOrdenesByIdTaller(IdTaller)
      ?.then((citas) => {
        if (citas) {
          return res.status(HttpStatus.OK).json(citas);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error });
      });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

export default {
  createOrden,
  updateOrden,
  getAllOrdenesByIdTaller,
  getOrdenById,
  getAllOrdenesByIdTallerAndFilter,
  getAllOrdenesByIdTallerAndIdCita,
  countOrdenesByIdTaller,
};
