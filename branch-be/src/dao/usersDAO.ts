import { WhereOptions } from "sequelize";
import { UserModel, VehiculoModel } from "../database/models";
import {
  UserInstance,
  UserCreationAttributes,
  VehiculoFilter,
  UserAttributes,
} from "../types";

const getById = (
  IdUsuario: string | number
): Promise<UserInstance | null> => {
  return UserModel.findByPk(IdUsuario);
};

const findAll = (): Promise<UserInstance[]> => UserModel.findAll();

const create = (
  usuario: UserCreationAttributes
): Promise<UserInstance> => {
  return UserModel.create(usuario);
};

const findOneByFilter = (
  filter: WhereOptions<UserAttributes> | undefined
): Promise<UserInstance | null> => {
  return UserModel.findOne({
    where: filter,
  });
};

const count = (
  filterUsuario: WhereOptions<UserAttributes> = {},
  filterVehiculo?: VehiculoFilter
): Promise<number> => {
  return UserModel.count({
    ...(filterVehiculo && {
      include: [
        {
          model: VehiculoModel,
          as: "vehiculos",
          where: {
            ...filterVehiculo,
          },
          required: true
        },
      ]
    }),
    where: filterUsuario,
    distinct: true,
  });
};

const deleteById = (
  IdUsuario: number | string
): Promise<number> => {
  return UserModel.destroy({
    where: { IdUsuario },
  });
};

const update = (
  filter: WhereOptions<UserAttributes>,
  user: Partial<UserCreationAttributes>
): Promise<[affectedCount: number]> | undefined => {
  return UserModel.update(user, {
    where: filter,
  });
};

const truncate = async(): Promise<void> => {
  await UserModel.truncate({ restartIdentity: true });
};

export default {
  getById,
  findAll,
  create,
  findOneByFilter,
  count,
  deleteById,
  update,
  truncate,
};


