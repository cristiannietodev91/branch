import { FindAndCountOptions, WhereOptions } from "sequelize";
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
): Promise<[affectedCount: number]> => {
  return VehiculoModel.update(vehiculo, {
    where: filterVehiculo,
  });
};

const create = (
  vehiculo: VehiculoCreationAttributes
): Promise<VehiculoInstance> => {
  return VehiculoModel.create(vehiculo);
};

const findOneByFilter = (
  filter: WhereOptions<VehiculoAttributes>
): Promise<VehiculoInstance | null> => {
  return VehiculoModel.findOne({
    include: [
      {
        model: MarcaModel,
        required: true
      },
      {
        model: UserModel,
        required: true
      },
      {
        model: TallerModel,
      },
    ],
    where: filter,
  });
};

const count = (
  filter: WhereOptions<VehiculoAttributes>
): Promise<number> => {
  return VehiculoModel.count({
    where: filter,
  });
};

const deleteById = (IdVehiculo: number): Promise<number> => {
  return VehiculoModel.destroy({
    where: { IdVehiculo },
  });
};

const getById = (
  IdVehiculo: number
): Promise<VehiculoInstance | null> => {
  return VehiculoModel.findByPk(IdVehiculo);
};

const findAllByFilter = (
  filter: WhereOptions<VehiculoAttributes>
): Promise<VehiculoInstance[]> => {
  return VehiculoModel.findAll({
    include: [
      {
        model: MarcaModel,
        required: true
      },
      {
        model: UserModel,
        required: true
      },
      {
        model: TallerModel,
      },
    ],
    where: filter,
  });
};

const findPaginateByFilter = (
  limit?: number,
  page = 1,
  filterVehiculo?: WhereOptions<VehiculoAttributes>,
  filterUsuario?: WhereOptions<UserCreationAttributes>
): Promise<{ rows: VehiculoInstance[]; count: number }> => {
  const options: Omit<FindAndCountOptions<VehiculoAttributes>, "group"> = {
    limit,
    ...(page && {offset: (page - 1) * (limit || 0)}),
    include: [
      {
        model: MarcaModel,
        required: true
      },
      {
        model: TallerModel,
      },
    ],
    where: filterVehiculo
  };
  
  if(filterUsuario && Array.isArray(options.include)) {
    options.include.push({
      model: UserModel,
      required: true,
      where: filterUsuario,
    });
  }
  return VehiculoModel.findAndCountAll(options);
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
