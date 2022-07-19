import citaDAO from "../dao/citaDAO";
import vehiculoDAO from "../dao/vehiculoDAO";
import mecanicoDAO from "../dao/mecanicoDAO";
import {
  CalificaCitaRequest,
  CitaAttributes,
  CitaInstance,
  CitaRequestAttributes,
  CitaUpdateAttributes,
  OrdenAttributes,
  VehiculoAttributes,
} from "../types";
import {
  parseTextByEstadoCita,
  parseTextoSms,
  sendDataToUser,
  sendNotificacionToUser,
  sendSMStoInfoBip,
} from "../utils/sendSms";
import { Op, Sequelize, WhereOptions } from "sequelize";
import moment from "moment";
import Debug from "debug";
import notificacionDAO from "../dao/notificacionDAO";
const debug = Debug("branch:server");

/**
 *
 */
const findAll = () => citaDAO.findAll();

/**
 *
 * @param {*} IdCita
 * @param {*} cb
 */
const findCitaByIdCita = (IdCita: string) => citaDAO.getById(IdCita);

/**
 *
 * @param {*} filterCita
 * @param {*} filtervehiculo
 * @param {*} filterOrden
 * @param {*} cb
 */
const findCitaByFilter = (
  filterCita: WhereOptions<CitaAttributes>,
  filtervehiculo: WhereOptions<VehiculoAttributes>,
  filterOrden: WhereOptions<OrdenAttributes>
) => citaDAO.findAllByFilter(filterCita, filtervehiculo, filterOrden);

const createCita = (cita: CitaRequestAttributes) => {
  return new Promise<CitaInstance>((resolve, reject) => {
    vehiculoDAO
      .findOneByFilter({ placa: cita.placa, IdTaller: cita.IdTaller })
      ?.then((vehiculo) => {
        if (vehiculo) {
          const citaDb = {
            IdVehiculo: vehiculo.IdVehiculo,
            IdTaller: cita.IdTaller,
            IdMecanico: cita.IdMecanico,
            fechaCita: moment(cita.fechaCita, "DD/MM/YYYY").toDate(),
            horaCita: cita.horaCita,
            servicio: cita.servicio,
            estado: cita.estado,
          };
          debug("Cita a persistir en la BD", citaDb);
          citaDAO
            .create(citaDb)
            ?.then((cita) => {
              if (cita) {
                debug(
                  " Mecanico a buscar para envio de SMS con Mecancio ::>",
                  cita.IdMecanico
                );
                mecanicoDAO
                  .getById(cita.IdMecanico)
                  ?.then((mecanico) => {
                    const textoSms = parseTextoSms(mecanico, vehiculo, cita);
                    if (vehiculo.usuarios?.celular) {
                      sendSMStoInfoBip(vehiculo.usuarios?.celular, textoSms);
                    }
                    if (vehiculo.usuarios?.tokenCM) {
                      sendNotificacionToUser(
                        vehiculo.usuarios?.tokenCM,
                        textoSms
                      );
                    }
                    if (vehiculo.usuarios && vehiculo.usuarios.uid) {
                      const notificacion = {
                        IdUsuario: vehiculo.usuarios.uid,
                        text: textoSms,
                        typenotificacion: "Cita",
                        read: false,
                        dataAdicional: {
                          IdCita: cita.IdCita,
                          calificada: true,
                        },
                      };
                      notificacionDAO.create(notificacion)?.then(() => {
                        if (vehiculo.usuarios?.tokenCM) {
                          sendDataToUser(
                            vehiculo.usuarios?.tokenCM,
                            "notificacion",
                            { IdCita: cita.IdCita }
                          );
                        }
                      });
                    }
                  })
                  .catch((error) => {
                    debug(error);
                  });
                resolve(cita);
              } else {
                reject(new Error("Appointment was not created"));
              }
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(
            new Error("No se encontro un vehiculo con la placa " + cita.placa)
          );
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateCitaByIdCita = (
  IdCita: string | number,
  cita: CitaUpdateAttributes
) => {
  return new Promise<CitaInstance | null>((resolve, reject) => {
    const momentHour = moment(cita.horaCita, "hh:mm:ss");
    const fechaCita = moment(cita.fechaCita, "DD/MM/YYYY")
      .hour(momentHour.hour())
      .minute(momentHour.minute());

    if (cita.estado.trim() === "") {
      return reject(new Error("State value is not valid"));
    }

    if (
      cita.estado !== "Cancelada" ||
      (cita.estado === "Cancelada" && fechaCita >= moment().add(1, "day"))
    ) {
      citaDAO.update(IdCita, cita)?.then(() => {
        citaDAO.getById(IdCita)?.then((cita) => {
          //Texto de cita con mecanico
          if (cita) {
            const textoSms = parseTextByEstadoCita(cita.estado, cita);
            /*if (cita.vehiculo?.usuarios?.celular) {
                sms.sendSMStoInfoBip(cita.vehiculo.usuarios?.celular, textoSms);
              }
              if (cita.vehiculo?.usuarios?.tokenCM) {
                sms.sendNotificacionToUser(
                  cita.vehiculo.usuarios?.tokenCM,
                  textoSms
                );
              }*/
            // Persistir notificacion

            if (
              cita.vehiculo &&
              cita.vehiculo.usuarios &&
              cita.vehiculo.usuarios.uid &&
              textoSms
            ) {
              const notificacion = {
                IdUsuario: cita.vehiculo?.usuarios?.uid,
                text: textoSms,
                typenotificacion: "Cita",
                read: false,
                dataAdicional: {
                  IdCita: cita.IdCita,
                  calificada: true,
                },
              };
              notificacionDAO.create(notificacion)?.then(() => {
                if (cita.vehiculo?.usuarios?.tokenCM) {
                  sendDataToUser(
                    cita.vehiculo.usuarios?.tokenCM,
                    "notificacion",
                    { IdCita: cita.IdCita }
                  );
                }
              });
            }

            resolve(cita);
          } else {
            resolve(cita);
          }
        });
      });
    } else {
      reject(new Error("Appoinments must be cancelled 24h before"));
    }
  });
};

const calificaCitaByIdCita = ({
  calificacion,
  calificacionUsuario,
  IdCita,
}: CalificaCitaRequest) => {
  return new Promise<CitaInstance | null>((resolve, reject) => {
    if (calificacion || calificacionUsuario) {
      const citaDb = {
        calificacion: calificacion,
        calificacionUsuario: calificacionUsuario,
      };

      citaDAO
        .update(IdCita, citaDb)
        ?.then(() => {
          citaDAO
            .getById(IdCita)
            ?.then((cita) => {
              resolve(cita);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((reason) => {
          reject(reason);
        });
    } else {
      reject(new Error("At least one calification is required"));
    }
  });
};

/**
 *
 * @param {*} IdTaller
 */
const getAllCitasByIdTaller = (IdTaller: string | number) => {
  return citaDAO.findAllByFilter(
    { IdTaller: IdTaller, estado: { [Op.ne]: "Cancelada" } },
    {},
    {}
  );
};

/**
 *
 * @param {*} IdUsuario
 */
const getAllCitasByIdUsuario = (IdUsuario: string | number) => {
  return citaDAO.findAllByFilter({}, { IdUsuario: IdUsuario }, {});
};

/**
 *
 * @param {*} IdUsuario
 */
const getAllCitasPasadasByIdUsuario = (IdUsuario: string | number) => {
  return citaDAO.findAllByFilter(
    {
      [Op.or]: [
        { estado: "Cancelada" },
        { estado: "Incumplida" },
        { estado: "Finalizada" },
      ],
    },
    { IdUsuario: IdUsuario },
    {}
  );
};

/**
 *
 * @param {*} IdUsuario
 */
const getAllCitasFuturasByIdUsuario = (IdUsuario: string | number) => {
  return citaDAO.findAllByFilter(
    {
      [Op.or]: [{ estado: "Solicitada" }, { estado: "Confirmada" }],
      fechaCita: { [Op.gte]: new Date() },
    },
    { IdUsuario: IdUsuario },
    { IdOrdenTrabajo: { [Op.is]: undefined } }
  );
};

/**
 *
 * @param {*} IdUsuario
 * @param {*} cb
 */
const getAllCitasActivasByIdUsuario = (IdUsuario: number | string) => {
  return citaDAO.findAllByFilter(
    { estado: "Cumplida" },
    { IdUsuario: IdUsuario },
    { [Op.or]: [{ estado: "Aceptado" }, { estado: "Pendiente" }] }
  );
};

const countCitasByIdTaller = (IdTaller: string) => {
  return citaDAO.count({ IdTaller: IdTaller });
};

const countCitasByEstadoIdTaller = (IdTaller: string | number) => {
  return citaDAO.count({ IdTaller: IdTaller }, ["estado"], ["estado"]);
};

const countCitasByDateAndIdTaller = (IdTaller: string | number) => {
  return citaDAO.count(
    { IdTaller: IdTaller },
    ["date"],
    [[Sequelize.literal("DATE(createdAt)"), "date"]]
  );
};

const deleteById = (IdCita: string): Promise<number> | undefined =>
  citaDAO.deleteById(IdCita);

export default {
  createCita,
  findAll,
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
  calificaCitaByIdCita,
  deleteById,
};
