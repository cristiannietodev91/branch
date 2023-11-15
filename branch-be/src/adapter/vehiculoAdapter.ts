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

const crearVehiculo = async (
  vehiculo: VehiculoCreationRequest
): Promise<VehiculoInstance | undefined> => {

  const vehiculoResult = await vehiculoDAO.findOneByFilter({ placa: vehiculo.placa });

  if(vehiculoResult) {
    if(vehiculoResult.taller) {
      throw new Error(ERROR_CREATEVEHICULOTALLERASIGNADO.message);
    }
    const { IdTaller } = vehiculo;

    const [resultUpdatevehiculo] = await vehiculoDAO.update(
      { IdVehiculo: vehiculoResult.IdVehiculo },
      { IdTaller: IdTaller }
    );
    
    if (resultUpdatevehiculo > 0) {
      const { usuarios } = vehiculoResult;
      if (usuarios && IdTaller) {
        sendNotification(usuarios, IdTaller, vehiculoResult);
      }

      return vehiculoResult;
    }

    throw new Error("Vehicle was not assigned to the workshop.");
  }

  const idMarca = await (async () => {
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
      } 
      return 1;
    } catch (error) {
      return 1;
    }
  })();

  const fechaCompraBD = vehiculo.fechaCompra
    ? moment(vehiculo.fechaCompra, "DD/MM/YYYY").toDate()
    : undefined;

  debug("Fecha compra valor para BD ",vehiculo.fechaCompra," Valor ::>", fechaCompraBD);

  if(!vehiculo.usuario || !vehiculo.usuario.email) {
    throw new Error("User email is required to create a vehicle");
  }

  const usuario = await usersDAO.findOneByFilter({ email: vehiculo.usuario.email });

  if(usuario) {
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
      const vehicleCreated = await crearVehiculoDB(vehiculoDB, usuario.uid, idMarca);

      if(vehicleCreated) {
        const { usuarios } = vehicleCreated;
        const { IdTaller } = vehicleCreated;
        if (usuarios && IdTaller) {
          sendNotification(
            usuarios,
            IdTaller,
            vehicleCreated
          );
        }

        return vehicleCreated;
      }

      throw new Error("Error creating vehicle for existing user");
    }

    throw new Error("Error creating vehicle for existing user, it does not have uid assigned");
  }

  const usuarioDB = {
    email: vehiculo.usuario.email,
    celular: `+57${vehiculo.celular}`, // TODO Add phone in the body request
    password: "123456",
    firstName: "Sin nombre",
    tipoUsuario: "Cliente" as const,
    estado: "Pendiente" as const,
    uid: vehiculo.usuario.uid || vehiculo.usuario.email,
  };

  const userCreated = await userDAO.create(usuarioDB);

  if(userCreated) {
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
    const vehiculoCreated = await crearVehiculoDB(
      vehiculoDB,
      userCreated.uid || userCreated.email,
      idMarca
    );

    if(vehiculoCreated) {
      const { usuarios } = vehiculoCreated;
      const { IdTaller } = vehiculoCreated;
      if (usuarios && IdTaller) {
        sendNotification(
          usuarios,
          IdTaller,
          vehiculoCreated
        );
      }

      return vehiculoCreated;
    }

    throw new Error("Error registering vehicle to the new user");
  }

  throw new Error("Error creating user.");
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
  vehiculoDAO.findPaginateByFilter(limit, page, filterVehiculo, filterUsuario);

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
