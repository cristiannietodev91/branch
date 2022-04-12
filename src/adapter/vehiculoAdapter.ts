import vehiculoDAO from "../dao/vehiculoDAO";
import marcaDAO from "../dao/marcaDAO";
import tallerDAO from "../dao/tallerDAO";
import userDAO from "../dao/usersDAO";
import sms from "../utils/sendSms";
import {
  VehiculoAttributes,
  UserAttributes,
  VehiculoInstance,
  VehiculoCreationAttributes,
  UserCreationAttributes,
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
  vehiculo: VehiculoAttributes
): Promise<VehiculoInstance | undefined> | undefined => {
  return new Promise((resolve, reject) => {
    vehiculoDAO
      .findOneByFilter({ placa: vehiculo.placa })
      ?.then(async (vehiculoResult) => {
        if (vehiculoResult) {
          if (vehiculoResult.taller) {
            reject(ERROR_CREATEVEHICULOTALLERASIGNADO);
          } else {
            const { IdTaller } = vehiculo;
            vehiculoResult.IdTaller = IdTaller;
            vehiculoDAO
              .update({ IdVehiculo: vehiculoResult.IdVehiculo }, vehiculoResult)
              ?.then((resultUpdatevehiculo) => {
                if (resultUpdatevehiculo) {
                  const { usuarios } = vehiculoResult;
                  sendNotification(usuarios, IdTaller, vehiculoResult);
                  resolve(vehiculoResult);
                }
              })
              .catch((error) => {
                reject(error);
              });
          }
        } else {
          const getIdMarca = async () => {
            try {
              if (vehiculo.marca) {
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
              }
            } catch (error) {
              return 1;
            }
          };

          const idMarca = await getIdMarca();

          const fechaCompraBD = vehiculo.fechaCompra
            ? moment(vehiculo.fechaCompra, "DD/MM/YYYY").toDate()
            : undefined;

          debug(
            "Fecha compra valor para BD ",
            vehiculo.fechaCompra,
            " Valor ::>",
            fechaCompraBD
          );

          usersDAO
            .findOneByFilter({ email: vehiculo.usuarios?.email })
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

                crearVehiculoDB(vehiculoDB, idMarca, usuario.uid)
                  .then((vehiculoCreated) => {
                    if (vehiculoCreated) {
                      const { usuarios } = vehiculoCreated;
                      const { IdTaller } = vehiculoCreated;
                      sendNotification(usuarios, IdTaller, vehiculoCreated);
                      resolve(vehiculoCreated);
                    }
                  })
                  .catch((error) => {
                    reject(error);
                  });
              } else {
                // No Encontro usuario lo va a crear
                const usuarioDB = {
                  email: vehiculo.usuarios?.email,
                  celular: "+57", // TODO Add celular en el cuerpo de la peticion:
                  password: "123456",
                  fullname: "Sin nombre",
                  tipoUsuario: "Cliente",
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
                        marca: vehiculo.marca,
                        modelo: vehiculo.modelo,
                        placa: vehiculo.placa,
                        tipoVehiculo: vehiculo.tipoVehiculo,
                        IdTaller: vehiculo.IdTaller,
                      };
                      // Se coloca Id de la tabla usuarios como UID mientras el usuario no este registrado en la BD
                      crearVehiculoDB(
                        vehiculoDB,
                        idMarca,
                        userCreate.IdUsuario.toString()
                      )
                        .then((vehiculoCreated) => {
                          if (vehiculoCreated) {
                            const { usuarios } = vehiculoCreated;
                            const { IdTaller } = vehiculoCreated;
                            sendNotification(
                              usuarios,
                              IdTaller,
                              vehiculoCreated
                            );
                            resolve(vehiculoCreated);
                          }
                        })
                        .catch((error) => {
                          reject(error);
                        });
                    }
                  })
                  .catch((error) => {
                    reject(error);
                  });
              }
            })
            .catch((error) => {
              reject(error);
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const crearVehiculoDB = (
  vehiculo: VehiculoCreationAttributes,
  idmarca?: number,
  userId?: string
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
    vehiculoDAO.create(vehiculoRegister)?.then((vehiculoCreated) => {
      if (vehiculoCreated) {
        resolve(vehiculoCreated);
      } else {
        reject(ERROR_CREATING_VEHICULE);
      }
    });
  });
};

const sendNotification = (
  usuarios: UserAttributes | undefined,
  IdTaller: string | number | undefined,
  vehiculoResult: VehiculoInstance
) => {
  if (usuarios && IdTaller) {
    const { tokenCM } = usuarios;
    debug("Usuario a enviar notificacion :::>", tokenCM);
    tallerDAO
      .getById(IdTaller)
      ?.then((taller) => {
        if (taller) {
          if (vehiculoResult.placa) {
            const textoSms = `El taller ${taller.nombre} acaba de registrar tu vehiculo ${vehiculoResult.placa}, ahora podras hacer seguimiento a las reparaciones y acceder a excelentes funcionalidades`;
            void sms.sendNotificacionToUser(tokenCM, textoSms, "vehiculo");
          }
        }
      })
      .catch((error) => {
        debug("Error al obtener Taller para enviar notificacion", error);
      });
  }
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
  vehiculo: VehiculoCreationAttributes,
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
              IdUsuario: vehiculo.usuarios.uid,
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
            reject(ERROR_CREATING_VEHICULE);
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
  findPaginateByFilter
};
