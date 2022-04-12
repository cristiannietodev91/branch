import citaDAO from "../dao/citaDAO";
import vehiculoDAO from "../dao/vehiculoDAO";
import mecanicoDAO from "../dao/mecanicoDAO";
import {
  CitaAttributes,
  CitaInstance,
  CitaRequestAttributes,
  OrdenAttributes,
  VehiculoAttributes,
} from "../types";
import sms from "../utils/sendSms";
import { Op, Sequelize, WhereOptions } from "sequelize";
//import sms from "../src/utils/sendSms";
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
          console.log("Cita a persistir en la BD", citaDb);
          citaDAO
            .create(citaDb)
            ?.then((cita) => {
              if (cita) {
                let textoSms = "";
                debug(
                  " Mecanico a buscar para envio de SMS con Mecancio ::>",
                  cita.IdMecanico
                );
                mecanicoDAO
                  .getById(cita.IdMecanico)
                  ?.then((mecanico) => {
                    if (mecanico) {
                      //Texto de cita con mecanico
                      textoSms =
                        "Hola " +
                        vehiculo.usuarios?.firstName +
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
                        vehiculo.usuarios?.firstName +
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
                    if (vehiculo.usuarios?.celular) {
                      sms.sendSMStoInfoBip(
                        vehiculo.usuarios?.celular,
                        textoSms
                      );
                    }
                    if (vehiculo.usuarios?.tokenCM) {
                      sms.sendNotificacionToUser(
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
                          sms.sendDataToUser(
                            vehiculo.usuarios?.tokenCM,
                            "notificacion",
                            { IdCita: cita.IdCita }
                          );
                        }
                      });
                    }
                    resolve(cita);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              } else {
                reject({ error: "No se creo la cita" });
              }
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject({
            error: "No se encontro un vehiculo con la placa " + cita.placa,
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateCitaByIdCita = (IdCita: string, cita: CitaAttributes) => {
  return new Promise<CitaInstance>((resolve, reject) => {
    if (IdCita) {
      let momentHour = moment(cita.horaCita, "hh:mm:ss");
      let fechaCita = moment(cita.fechaCita, "DD/MM/YYYY")
        .hour(momentHour.hour())
        .minute(momentHour.minute());

      let citaDb = {
        IdTaller: cita.IdTaller,
        IdMecanico: cita.IdMecanico,
        fechaCita: cita.fechaCita,
        horaCita: cita.horaCita,
        servicio: cita.servicio,
        estado: cita.estado,
        calificacion: cita.calificacion,
        calificacionUsuario: cita.calificacionUsuario,
      };

      if (
        cita.estado != "Cancelada" ||
        (cita.estado == "Cancelada" && fechaCita >= moment().add(1, "day"))
      ) {
        citaDAO.update(IdCita, citaDb)?.then((value) => {
          citaDAO.getById(IdCita)?.then((cita) => {
            let textoSms = "";
            //Texto de cita con mecanico
            if (cita) {
              if (cita.estado == "Confirmada") {
                textoSms = "Se confirmo su cita exitosamente";
              } else {
                if (cita.estado == "Cancelada") {
                  textoSms =
                    "Hola " +
                    cita.vehiculo?.usuarios?.firstName +
                    "! Se cancelo la cita que tenias el " +
                    moment(cita.fechaCita).format("D [de] MMMM YYYY") +
                    " a las " +
                    cita.horaCita +
                    " con tu " +
                    cita.vehiculo?.tipoVehiculo +
                    "  " +
                    cita.vehiculo?.placa +
                    ", BRANCH tendra el gusto de recibirte en una proxima oportunidad. Tu experiencia nuestro motor! BRANCH";
                } else {
                  if (cita.estado == "Incumplida") {
                    textoSms =
                      "Hola " +
                      cita.vehiculo?.usuarios?.firstName +
                      "! Incumpliste la cita que tenias el " +
                      moment(cita.fechaCita).format("D [de] MMMM YYYY") +
                      " a las " +
                      cita.horaCita +
                      " con tu " +
                      cita.vehiculo?.tipoVehiculo +
                      "  " +
                      cita.vehiculo?.placa +
                      ", esto afectara tu puntuacion en nuestra plataforma. BRANCH tendra el gusto de recibirte en una proxima oportunidad. Tu experiencia nuestro motor! BRANCH";
                  } else {
                    textoSms =
                      "Hola " +
                      cita.vehiculo?.usuarios?.firstName +
                      "! Su cita quedo asignada el " +
                      moment(cita.fechaCita).format("D [de] MMMM YYYY") +
                      " a las " +
                      cita.horaCita +
                      " con tu " +
                      cita.vehiculo?.tipoVehiculo +
                      "  " +
                      cita.vehiculo?.placa +
                      ", " +
                      cita.mecanico?.firstName +
                      " de BRANCH tendra el gusto de recibirte. Tu experiencia nuestro motor! BRANCH";
                  }
                }
              }
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
              const notificacion = {
                IdUsuario: cita.vehiculo?.usuarios?.uid,
                text: textoSms,
                typenotificacion: "Cita",
                read: false,
                dataAdicional: { IdCita: cita.IdCita, calificada: true },
              };

              if (cita.vehiculo && cita.vehiculo.usuarios && cita.vehiculo.usuarios.uid) {
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
                    sms.sendDataToUser(
                      cita.vehiculo.usuarios?.tokenCM,
                      "notificacion",
                      { IdCita: cita.IdCita }
                    );
                  }
                });
              }

              resolve(cita);
            }
          });
        });
      } else {
        reject(
          new Error("Solo se puede cancelar una cita hasta 24 horas antes.")
        );
      }
    } else {
      reject(new Error("El parametro IdCita es requerido"));
    }
  });
};

const calificaCitaByIdCita = (
  IdCita: string,
  calificacion: number,
  calificacionUsuario: number
) => {
  return new Promise((resolve, reject) => {
    if (IdCita) {
      let citaDb = {
        calificacion: calificacion,
        calificacionUsuario: calificacionUsuario,
      };

      citaDAO
        .update(IdCita, citaDb)
        ?.then((value) => {
          citaDAO.getById(IdCita)?.then((cita) => {
            resolve(cita);
          });
        })
        .catch((reason) => {
          reject(reason);
        });
    } else {
      reject("El parametro IdCita es requerido");
    }
  });
};

/**
 *
 * @param {*} IdTaller
 */
const getAllCitasByIdTaller = (IdTaller: string) => {
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
    { IdOrdenTrabajo: { [Op.is]: null } }
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
    [[Sequelize.literal(`DATE(createdAt)`), "date"]]
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
  deleteById
};
