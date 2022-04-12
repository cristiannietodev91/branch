import serviciosDAO from "../dao/servicioDAO";
import servicioVehiculoDAO from "../dao/servicioVehiculoDAO";
import vehiculoDAO from "../dao/vehiculoDAO";
import { CreationServiceAttributes, ServicioVehiculoAttributes, ServicioVehiculoInstance } from "../types";

const listarServicios = () => {
  return serviciosDAO.findAll();
};

/**
 *
 * @param {*} paramservicio
 * @param {*} cb
 */
const crearServicio = (paramservicio: CreationServiceAttributes) => {
  return new Promise<ServicioVehiculoInstance>((resolve, reject)=>{
    if (paramservicio && paramservicio.placa) {
      vehiculoDAO.findOneByFilter(
        { placa: paramservicio.placa })?.then((vehiculo)=>{
          if(vehiculo){
            const servicoDb: ServicioVehiculoAttributes  = {
              //TODO: Id servicio seems not to be needed
              IdServicio: 1,
              IdVehiculo: vehiculo.IdVehiculo,
              servicio: paramservicio.servicio,
              valor: paramservicio.valor,
            };
            servicioVehiculoDAO.create(servicoDb)?.then((servicio)=>{
              resolve(servicio);
            }).catch((error)=>{
              reject(error);
            });
          }
        }).catch((error)=>{
          reject(error);
        })
    }else {
      //TODO Error si no viene placa
    }
  })
  
    
};

/**
 *
 * @param {*} IdVehiculo
 * @param {*} cb
 */
const listarServiciosByVehiculo = (IdVehiculo: number | string) => {
  return servicioVehiculoDAO.findAllByFilter(
    { IdVehiculo: IdVehiculo });
};

export default {
  listarServicios,
  crearServicio,
  listarServiciosByVehiculo,
};
