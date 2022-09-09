import { WhereOptions } from "sequelize";
import { MecanicoModel, TallerModel } from "../database/models";
import {
  MecanicoAttributes,
  MecanicoCreationAttributes,
  MecanicoInstance,
  TallerAttributes,
} from "../types";

const findAll = (): Promise<MecanicoInstance[]> => MecanicoModel.findAll();

const create = (
  mecanico: MecanicoCreationAttributes
): Promise<MecanicoInstance> | undefined => {
  // Find all users
  return MecanicoModel.sequelize?.transaction((t1) => {
    return MecanicoModel.create(mecanico);
  });
};

const update = (
  IdMecanico: string,
  mecanico: Partial<MecanicoAttributes>
): Promise<[affectedCount: number]> | undefined => {
  // Find all users
  return MecanicoModel.sequelize?.transaction((t1) => {
    return MecanicoModel.update(mecanico, {
      where: { IdMecanico: IdMecanico },
    });
  });
};

const getById = (
  IdMecanico: number | string
): Promise<MecanicoInstance | null> | undefined => {
  // Find all users
  return MecanicoModel.sequelize?.transaction((t1) => {
    return MecanicoModel.findByPk(IdMecanico);
  });
};

const deleteById = (
  IdMecanico: number | string
): Promise<number> | undefined => {
  // Find all users
  return MecanicoModel.sequelize?.transaction((t1) => {
    return MecanicoModel.destroy({
      where: { IdMecanico: IdMecanico },
    });
  });
};

const findAllByFilter = (
  filterTaller: WhereOptions<TallerAttributes>,
  filterMecancio: WhereOptions<MecanicoInstance>
): Promise<MecanicoInstance[]> | undefined => {
  // Find all users
  return MecanicoModel.sequelize?.transaction((t1) => {
    return MecanicoModel.findAll({
      include: [
        {
          model: TallerModel,
          where: filterTaller,
        },
      ],
      where: filterMecancio,
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
