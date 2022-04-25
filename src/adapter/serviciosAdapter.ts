import serviciosDAO from "../dao/servicioDAO";
import servicioVehiculoDAO from "../dao/servicioVehiculoDAO";
import vehiculoDAO from "../dao/vehiculoDAO";
import {
  CreationServiceAttributes,
  ServicioVehiculoCreationAttributes,
  ServicioVehiculoInstance,
} from "../types";

const listarServicios = () => {
  return serviciosDAO.findAll();
};

/**
 *
 * @param {*} paramservicio
 * @param {*} cb
 */
const crearServicio = (paramservicio: CreationServiceAttributes) => {
  return new Promise<ServicioVehiculoInstance>((resolve, reject) => {
    vehiculoDAO
      .findOneByFilter({ placa: paramservicio.placa })
      ?.then((vehiculo) => {
        if (vehiculo) {
          const servicoDb: ServicioVehiculoCreationAttributes = {
            IdVehiculo: vehiculo.IdVehiculo,
            servicio: paramservicio.servicio,
            valor: paramservicio.valor,
          };
          servicioVehiculoDAO
            .create(servicoDb)
            ?.then((servicio) => {
              resolve(servicio);
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

/**
 *
 * @param {*} IdVehiculo
 * @param {*} cb
 */
const listarServiciosByVehiculo = (IdVehiculo: number | string) => {
  return servicioVehiculoDAO.findAllByFilter({ IdVehiculo: IdVehiculo });
};

export default {
  listarServicios,
  crearServicio,
  listarServiciosByVehiculo,
};
