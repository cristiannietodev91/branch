import { WhereOptions } from "sequelize";
import { EtapaModel } from "../database/models";
import { EtapaAttributes, EtapaCreationAttributes, EtapaInstance } from "../types";

const findAll = (): Promise<EtapaInstance[]> => EtapaModel.findAll();

const findAllUnique = (): Promise<EtapaInstance[]> =>
  EtapaModel.findAll({
    attributes: ["marca"],
    group: ["marca"],
  });

const create = (etapa: EtapaCreationAttributes): Promise<EtapaInstance> | undefined => {
  return EtapaModel.sequelize?.transaction(() => {
    return EtapaModel.create(etapa);
  });
};

const findOneByFilter = (
  filterEtapa: WhereOptions<EtapaAttributes> | undefined
): Promise<EtapaInstance | null> | undefined => {
  return EtapaModel.sequelize?.transaction(() => {
    return EtapaModel.findOne({
      where: filterEtapa,
    });
  });
};

const findAllByFilter = (filterEtapa: WhereOptions<EtapaAttributes>) => {
  // Find all users
  return EtapaModel.sequelize?.transaction((t1) => {
    return EtapaModel.findAll({
      where: filterEtapa,
    });
  });
};

const update = (IdEtapa: string, etapa: Partial<EtapaAttributes>) => {
  // Find all users
  return EtapaModel.sequelize?.transaction((t1) => {
    return EtapaModel.update(etapa, {
      where: { IdEtapa: IdEtapa },
    });
  });
};

const getById = (IdEtapa: number | string) => {
  // Find all users
  return EtapaModel.sequelize?.transaction((t1) => {
    return EtapaModel.findByPk(IdEtapa);
  });
};

const deleteById = (IdEtapa: string): Promise<number> | undefined => {
  // Find all users
  return EtapaModel.sequelize?.transaction((t1) => {
    return EtapaModel.destroy({
      where: { IdEtapa: IdEtapa },
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
