import vehiculoDAO from "../dao/vehiculoDAO";
import marcaDAO from "../dao/marcaDAO";
import tallerDAO from "../dao/tallerDAO";
import userDAO from "../dao/usersDAO";
import { sendNotificacionToUser } from "../utils/sendSms";
import {
  VehiculoAttributes,
  UserAttributes,
  VehiculoInstance,
  VehiculoCreationAttributes,
  UserCreationAttributes,
  VehiculoPreCreationAttributes,
  VehiculoCreationRequest,
} from "../types";
import {
  ERROR_CREATEVEHICULOTALLERASIGNADO,
  ERROR_CREATING_VEHICULE,
} from "../utils/resultsMessages";
import Debug from "debug";
import usersDAO from "../dao/usersDAO";
import moment from "moment";
import { WhereOptions } from "sequelize";
const debug = Debug("branch:server");
moment.locale("es");

const findAllVehiculos = (): Promise<VehiculoInstance[]> =>
  vehiculoDAO.findAll();

const deleteById = (IdVehiculo: number): Promise<number> | undefined =>
  vehiculoDAO.deleteById(IdVehiculo);

const getById = (
  IdVehiculo: number
): Promise<VehiculoInstance | null> | undefined =>
  vehiculoDAO.getById(IdVehiculo);

const crearVehiculo = (
  vehiculo: VehiculoCreationRequest
): Promise<VehiculoInstance | undefined> | undefined => {
  return new Promise((resolve, reject) => {
    vehiculoDAO
      .findOneByFilter({ placa: vehiculo.placa })
      ?.then(async (vehiculoResult) => {
        if (vehiculoResult) {
          if (vehiculoResult.taller) {
            reject(new Error(ERROR_CREATEVEHICULOTALLERASIGNADO.message));
          } else {
            const { IdTaller } = vehiculo;
            vehiculoResult.IdTaller = IdTaller;
            vehiculoDAO
              .update({ IdVehiculo: vehiculoResult.IdVehiculo }, vehiculoResult)
              ?.then((resultUpdatevehiculo) => {
                if (resultUpdatevehiculo) {
                  const { usuarios } = vehiculoResult;
                  if (usuarios) {
                    sendNotification(usuarios, IdTaller, vehiculoResult);
                  }

                  resolve(vehiculoResult);
                }
              })
              .catch((error) => {
                reject(error);
              });
          }
        } else {
          const idMarca = await (async () => {
            try {
              /*if (vehiculo.marca) {
                const marca = await marcaDAO.findOneByFilter({
                  marca: vehiculo.marca.marca,
                  referencia: vehiculo.marca.referencia,
                });
                if (marca) {
                  return marca.IdMarca;
                } else {
                  return 1;
                }
              } else {
                return 1;
              }*/
              return 1;
            } catch (error) {
              return 1;
            }
          })();

          const fechaCompraBD = vehiculo.fechaCompra
            ? moment(vehiculo.fechaCompra, "DD/MM/YYYY").toDate()
            : undefined;

          debug(
            "Fecha compra valor para BD ",
            vehiculo.fechaCompra,
            " Valor ::>",
            fechaCompraBD
          );

          if (vehiculo.usuario && vehiculo.usuario.email) {
            usersDAO
              .findOneByFilter({ email: vehiculo.usuario.email })
              ?.then((usuario) => {
                if (usuario) {
                  const vehiculoDB = {
                    alias: vehiculo.alias,
                    color: vehiculo.color,
                    fechaCompra: fechaCompraBD,
                    fotos: vehiculo.fotos,
                    kilometraje: vehiculo.kilometraje,
                    modelo: vehiculo.modelo,
                    placa: vehiculo.placa,
                    tipoVehiculo: vehiculo.tipoVehiculo,
                    IdTaller: vehiculo.IdTaller,
                  };
                  if (usuario.uid) {
                    crearVehiculoDB(vehiculoDB, usuario.uid, idMarca)
                      .then((vehiculoCreated) => {
                        if (vehiculoCreated) {
                          const { usuarios } = vehiculoCreated;
                          const { IdTaller } = vehiculoCreated;
                          if (usuarios) {
                            sendNotification(
                              usuarios,
                              IdTaller,
                              vehiculoCreated
                            );
                          }

                          resolve(vehiculoCreated);
                        }
                      })
                      .catch((error) => {
                        reject(error);
                      });
                  }
                } else {
                  // No Encontro usuario lo va a crear
                  if (vehiculo.usuario && vehiculo.usuario.email) {
                    const usuarioDB = {
                      email: vehiculo.usuario?.email,
                      celular: `+57${vehiculo.celular}`, // TODO Add celular en el cuerpo de la peticion:
                      password: "123456",
                      firstName: "Sin nombre",
                      tipoUsuario: "Cliente" as const,
                      estado: "Pendiente" as const,
                      uid: vehiculo.usuario.uid,
                    };

                    userDAO
                      .create(usuarioDB)
                      ?.then((userCreate) => {
                        if (userCreate) {
                          const vehiculoDB = {
                            alias: vehiculo.alias,
                            color: vehiculo.color,
                            fechaCompra: fechaCompraBD,
                            fotos: vehiculo.fotos,
                            kilometraje: vehiculo.kilometraje,
                            modelo: vehiculo.modelo,
                            placa: vehiculo.placa,
                            tipoVehiculo: vehiculo.tipoVehiculo,
                            IdTaller: vehiculo.IdTaller,
                          };
                          // Se coloca Id de la tabla usuarios como UID mientras el usuario no este registrado en la BD
                          crearVehiculoDB(
                            vehiculoDB,
                            userCreate.uid || userCreate.IdUsuario.toString(),
                            idMarca
                          )
                            .then((vehiculoCreated) => {
                              if (vehiculoCreated) {
                                const { usuarios } = vehiculoCreated;
                                const { IdTaller } = vehiculoCreated;
                                if (usuarios) {
                                  sendNotification(
                                    usuarios,
                                    IdTaller,
                                    vehiculoCreated
                                  );
                                }

                                resolve(vehiculoCreated);
                              }
                            })
                            .catch((error) => {
                              reject(error);
                            });
                        } else {
                          reject(
                            new Error("User created but it returned undefined")
                          );
                        }
                      })
                      .catch((error) => {
                        debug("Error creating user", error);
                        reject(error);
                      });
                  }
                }
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            reject(new Error("User email is required to create a vehicle"));
          }
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const crearVehiculoDB = (
  vehiculo: VehiculoPreCreationAttributes,
  userId: string,
  idmarca?: number
): Promise<VehiculoInstance> => {
  return new Promise((resolve, reject) => {
    const vehiculoRegister = {
      IdMarca: idmarca || 1,
      IdUsuario: userId,
      IdTaller: vehiculo.IdTaller,
      tipoVehiculo: "Moto",
      placa: vehiculo.placa,
      estado: "Pendiente",
      alias: vehiculo.alias,
      color: vehiculo.color,
      fechaCompra: vehiculo.fechaCompra,
      kilometraje: vehiculo.kilometraje,
      modelo: vehiculo.modelo,
      fotos: vehiculo.fotos,
    };
    vehiculoDAO
      .create(vehiculoRegister)
      ?.then((vehiculoCreated) => {
        if (vehiculoCreated) {
          resolve(vehiculoCreated);
        } else {
          reject(ERROR_CREATING_VEHICULE);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const sendNotification = (
  usuarios: UserAttributes,
  IdTaller: string | number,
  vehiculoResult: VehiculoInstance
) => {
  const { tokenCM } = usuarios;
  debug("Usuario a enviar notificacion :::>", tokenCM);

  tallerDAO
    .getById(IdTaller)
    ?.then((taller) => {
      if (taller) {
        if (vehiculoResult.placa && tokenCM) {
          const textoSms = `El taller ${taller.nombre} acaba de registrar tu vehiculo ${vehiculoResult.placa}, ahora podras hacer seguimiento a las reparaciones y acceder a excelentes funcionalidades`;
          void sendNotificacionToUser(tokenCM, textoSms, "vehiculo");
        }
      }
    })
    .catch((error) => {
      console.log("error ::>", error);
      debug("Error al obtener Taller para enviar notificacion", error);
    });
};

const countVehiculosByIdTaller = (
  IdTaller: number
): Promise<number> | undefined => vehiculoDAO.count({ IdTaller });

const findOneByFilter = (
  filter: WhereOptions<VehiculoAttributes>
): Promise<VehiculoInstance | null> | undefined =>
  vehiculoDAO.findOneByFilter(filter);

const findAllByFilter = (
  filter: WhereOptions<VehiculoAttributes>
): Promise<VehiculoInstance[]> | undefined =>
  vehiculoDAO.findAllByFilter(filter);

const updateVehiculo = (
  vehiculo: Partial<VehiculoCreationAttributes>,
  IdVehiculo: number
): Promise<[affectedCount: number]> => {
  return new Promise((resolve, reject) => {
    if (vehiculo.marca) {
      marcaDAO
        .findOneByFilter({
          marca: vehiculo.marca?.marca,
          referencia: vehiculo.marca?.referencia,
        })
        ?.then((marca) => {
          if (marca && vehiculo.usuarios) {
            const vehiculoUpdate = {
              IdMarca: marca.IdMarca,
              IdUsuario: vehiculo.usuarios.IdUsuario,
              IdTaller: vehiculo.IdTaller,
              tipoVehiculo: "Moto",
              placa: vehiculo.placa,
              estado: "Pendiente",
              alias: vehiculo.alias,
              color: vehiculo.color,
              fechaCompra: vehiculo.fechaCompra,
              kilometraje: vehiculo.kilometraje,
              modelo: vehiculo.modelo,
              fotos: vehiculo.fotos,
              soat: vehiculo.soat,
              tecnomecanica: vehiculo.tecnomecanica,
            };

            vehiculoDAO
              .update({ IdVehiculo }, vehiculoUpdate)
              ?.then((vehiculoUpdated) => {
                resolve(vehiculoUpdated);
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            reject(new Error(ERROR_CREATING_VEHICULE.message));
          }
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

const findPaginateByFilter = (
  page: number,
  limit: number,
  filterVehiculo: WhereOptions<VehiculoAttributes>,
  filterUsuario: WhereOptions<UserCreationAttributes>
): Promise<{ rows: VehiculoInstance[]; count: number }> | undefined =>
  vehiculoDAO.findPaginateByFilter(page, limit, filterVehiculo, filterUsuario);

export default {
  crearVehiculo,
  countVehiculosByIdTaller,
  findAllVehiculos,
  findOneByFilter,
  updateVehiculo,
  deleteById,
  getById,
  findAllByFilter,
  findPaginateByFilter,
};
