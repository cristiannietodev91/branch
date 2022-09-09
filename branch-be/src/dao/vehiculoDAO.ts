import { WhereOptions } from "sequelize";
import {
  MarcaModel,
  TallerModel,
  UserModel,
  VehiculoModel,
} from "../database/models";
import {
  VehiculoCreationAttributes,
  VehiculoInstance,
  UserCreationAttributes,
  VehiculoAttributes,
} from "../types";

const findAll = (): Promise<VehiculoInstance[]> => VehiculoModel.findAll();

const update = (
  filterVehiculo: WhereOptions<VehiculoAttributes>,
  vehiculo: Partial<VehiculoAttributes>
): Promise<[affectedCount: number]> | undefined => {
  return VehiculoModel.sequelize?.transaction(() => {
    return VehiculoModel.update(vehiculo, {
      where: filterVehiculo,
    });
  });
};

const create = (
  vehiculo: VehiculoCreationAttributes
): Promise<VehiculoInstance> | undefined => {
  // Find all users
  return VehiculoModel.sequelize?.transaction(() => {
    return VehiculoModel.create(vehiculo);
  });
};

const findOneByFilter = (
  filter: WhereOptions<VehiculoAttributes>
): Promise<VehiculoInstance | null> | undefined => {
  // Find all users
  return VehiculoModel.sequelize?.transaction((t1) => {
    return VehiculoModel.findOne({
      include: [
        {
          model: MarcaModel,
        },
        {
          model: UserModel,
        },
        {
          model: TallerModel,
        },
      ],
      where: filter,
    });
  });
};

const count = (
  filter: WhereOptions<VehiculoAttributes>
): Promise<number> | undefined => {
  return VehiculoModel.sequelize?.transaction(() => {
    return VehiculoModel.count({
      where: filter,
    });
  });
};

const deleteById = (IdVehiculo: number): Promise<number> | undefined => {
  // Find all users
  return VehiculoModel.sequelize?.transaction((t1) => {
    return VehiculoModel.destroy({
      where: { IdVehiculo },
    });
  });
};

const getById = (
  IdVehiculo: number
): Promise<VehiculoInstance | null> | undefined => {
  // Find all vehiculos
  return VehiculoModel.sequelize?.transaction((t1) => {
    return VehiculoModel.findByPk(IdVehiculo);
  });
};

const findAllByFilter = (
  filter: WhereOptions<VehiculoAttributes>
): Promise<VehiculoInstance[]> | undefined => {
  // Find all users
  return VehiculoModel.sequelize?.transaction(() => {
    return VehiculoModel.findAll({
      include: [
        {
          model: MarcaModel,
        },
        {
          model: UserModel,
        },
        {
          model: TallerModel,
        },
      ],
      where: filter,
    });
  });
};

const findPaginateByFilter = (
  page: number,
  limit: number,
  filterVehiculo: WhereOptions<VehiculoAttributes> | undefined,
  filterUsuario: WhereOptions<UserCreationAttributes>
): Promise<{ rows: VehiculoInstance[]; count: number }> | undefined => {
  const options = {
    limit,
    offset: page,
    include: [
      {
        model: MarcaModel,
      },
      {
        model: UserModel,
        required: true,
        where: filterUsuario,
      },
      {
        model: TallerModel,
      },
    ],
    where: filterVehiculo
  };
  // Find all users
  return VehiculoModel.sequelize?.transaction((t1) => {
    return VehiculoModel.findAndCountAll(options);
  });
};

export default {
  create,
  update,
  findAll,
  findOneByFilter,
  count,
  deleteById,
  getById,
  findAllByFilter,
  findPaginateByFilter,
};
