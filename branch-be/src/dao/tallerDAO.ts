import { TallerModel, MecanicoModel } from "../database/models";
import { TallerInstance, TallerCreationAttributes } from "../types";

const getById = (
  IdTaller: number | string
): Promise<TallerInstance | null> | undefined => {
  return TallerModel.sequelize?.transaction(() => {
    return TallerModel.findByPk(IdTaller, {
      include: {
        model: MecanicoModel,
      },
    });
  });
};

const findAll = (): Promise<TallerInstance[]> => TallerModel.findAll();

const create = (
  taller: TallerCreationAttributes
): Promise<TallerInstance> => {
  return TallerModel.create(taller);
};

const update = (
  IdTaller: number,
  taller: Partial<TallerCreationAttributes>
): Promise<[affectedCount: number]> | undefined => {
  // Find all users
  return TallerModel.sequelize?.transaction((t1) => {
    return TallerModel.update(taller, {
      where: { IdTaller },
    });
  });
};

const deleteById = (IdTaller: number): Promise<number> | undefined => {
  // Find all users
  return TallerModel.sequelize?.transaction(() => {
    return TallerModel.destroy({
      where: { IdTaller },
    });
  });
};

export default {
  getById,
  findAll,
  create,
  update,
  deleteById,
};
