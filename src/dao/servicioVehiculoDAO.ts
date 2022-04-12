import { WhereOptions } from "sequelize";
import { ServicioVehiculoModel } from "../database/models";
import { ServicioVehiculoAttributes, ServicioVehiculoInstance } from "../types";

const findAll = () => ServicioVehiculoModel.findAll();

const create = (servicio: ServicioVehiculoAttributes) => {
  return ServicioVehiculoModel.sequelize?.transaction((t1) => {
    return ServicioVehiculoModel.create(servicio);
  });
};

const update = (IdServicio: number, servicio: Partial<ServicioVehiculoAttributes>) => {
  return ServicioVehiculoModel.sequelize?.transaction((t1) => {
    return ServicioVehiculoModel.update(servicio, {
      where: { IdServicio: IdServicio },
    });
  });
};

const getById = (IdServicio: number) => {
  return ServicioVehiculoModel.sequelize?.transaction((t1) => {
    return ServicioVehiculoModel.findByPk(IdServicio, {});
  });
};

const deleteById = (IdServicio: number) => {
  return ServicioVehiculoModel.sequelize?.transaction((t1) => {
    return ServicioVehiculoModel.destroy({
      where: { IdServicio: IdServicio },
    });
  });
};

const findAllByFilter = (
  filterServicio: WhereOptions<ServicioVehiculoAttributes>
) => {
  return ServicioVehiculoModel.sequelize?.transaction((t1) => {
    return ServicioVehiculoModel.findAll({
      where: filterServicio,
    });
  });
};

export default {
  findAll,
  create,
  update,
  getById,
  deleteById,
  findAllByFilter,
};
