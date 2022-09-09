import { ServicioModel } from "../database/models";
import {
  ServicioAttributes,
  ServicioCreationAttributes,
} from "../types";

const findAll = () => ServicioModel.findAll();

const create = (servicio: ServicioCreationAttributes) => {
  // Find all users
  return ServicioModel.sequelize?.transaction((t1) => {
    return ServicioModel.create(servicio);
  });
};

const update = (IdServicio: number, servicio: Partial<ServicioAttributes>) => {
  // Find all users
  return ServicioModel.sequelize?.transaction((t1) => {
    return ServicioModel.update(servicio, {
      where: { IdServicio: IdServicio },
    });
  });
};

const getById = (IdServicio: number) => {
  return ServicioModel.sequelize?.transaction((t1) => {
    return ServicioModel.findByPk(IdServicio, {});
  });
};

const deleteById = (IdServicio: number) => {
  // Find all users
  return ServicioModel.sequelize?.transaction((t1) => {
    return ServicioModel.destroy({
      where: { IdServicio: IdServicio },
    });
  });
};

export default {
  findAll,
  create,
  update,
  getById,
  deleteById,
};
