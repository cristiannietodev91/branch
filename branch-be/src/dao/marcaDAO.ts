import { WhereOptions } from "sequelize";
import { MarcaModel } from "../database/models";
import { MarcaInstance, MarcaAttributes, MarcaCreationAttributes } from "../types";

const findAll = (): Promise<MarcaInstance[]> => MarcaModel.findAll();

const findAllUnique = (): Promise<MarcaInstance[]> =>
  MarcaModel.findAll({
    attributes: ["marca"],
    group: ["marca"],
  });

const create = (marca: MarcaCreationAttributes): Promise<MarcaInstance> | undefined => {
  return MarcaModel.sequelize?.transaction(() => {
    return MarcaModel.create(marca);
  });
};

const findOneByFilter = (
  filterMarca: WhereOptions<MarcaAttributes> = {}
): Promise<MarcaInstance | null>=> {
  return MarcaModel.findOne({
    where: filterMarca,
  });
};

const findAllByFilter = (filterMarca: WhereOptions<MarcaAttributes>) => {
  // Find all users
  return MarcaModel.sequelize?.transaction((t1) => {
    return MarcaModel.findAll({
      where: filterMarca,
    });
  });
};

const update = (IdMarca: string, marca: Partial<MarcaAttributes>) => {
  // Find all users
  return MarcaModel.sequelize?.transaction((t1) => {
    return MarcaModel.update(marca, {
      where: { IdMarca: IdMarca },
    });
  });
};

const getById = (IdMarca: number | string) => {
  // Find all users
  return MarcaModel.sequelize?.transaction((t1) => {
    return MarcaModel.findByPk(IdMarca);
  });
};

const deleteById = (IdMarca: string): Promise<number> | undefined => {
  // Find all users
  return MarcaModel.sequelize?.transaction((t1) => {
    return MarcaModel.destroy({
      where: { IdMarca: IdMarca },
    });
  });
};

export default {
  deleteById,
  getById,
  findAll,
  findAllUnique,
  create,
  update,
  findOneByFilter,
  findAllByFilter,
};
