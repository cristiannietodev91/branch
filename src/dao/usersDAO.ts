import { WhereOptions } from "sequelize";
import { UserModel, VehiculoModel } from "../database/models";
import {
  UserInstance,
  UserCreationAttributes,
  VehiculoFilter,
  UserAttributes,
} from "../types";

const getById = (
  IdUsuario: string
): Promise<UserInstance | null> | undefined => {
  return UserModel.sequelize?.transaction(() => UserModel.findByPk(IdUsuario));
};

const findAll = (): Promise<UserInstance[]> => UserModel.findAll();

const create = (
  usuario: UserCreationAttributes
): Promise<UserInstance> | undefined => {
  // Find all users
  return UserModel.sequelize?.transaction(() => UserModel.create(usuario));
};

const findOneByFilter = (
  filter: WhereOptions<UserAttributes> | undefined
): Promise<UserInstance | null> | undefined => {
  // Find all users
  return UserModel.sequelize?.transaction(() => {
    return UserModel.findOne({
      where: filter,
    });
  });
};

const count = (
  filterUsuario: WhereOptions<UserAttributes>,
  filterVehiculo: VehiculoFilter
): Promise<number> | undefined => {
  return UserModel.sequelize?.transaction(() => {
    return UserModel.count({
      include: [
        {
          model: VehiculoModel,
          as: "vehiculos",
          where: {
            ...filterVehiculo,
          },
          required: false
        },
      ],
      where: filterUsuario,
      distinct: true,
    });
  });
};

const deleteById = (
  IdUsuario: number | string
): Promise<number> | undefined => {
  return UserModel.sequelize?.transaction(() => {
    return UserModel.destroy({
      where: { IdUsuario },
    });
  });
};

const update = (
  filter: WhereOptions<UserAttributes>,
  usuario: Partial<UserCreationAttributes>
): Promise<[affectedCount: number]> | undefined => {
  // Find all users
  return UserModel.sequelize?.transaction(() => {
    return UserModel.update(usuario, {
      where: filter,
    });
  });
};

export default {
  getById,
  findAll,
  create,
  findOneByFilter,
  count,
  deleteById,
  update,
};


