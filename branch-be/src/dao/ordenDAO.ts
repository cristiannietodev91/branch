import {
  FindAttributeOptions,
  GroupOption,
  WhereOptions,
} from "sequelize";
import {
  CitaModel,
  EtapaModel,
  MarcaModel,
  MecanicoModel,
  OrdenModel,
  TallerModel,
  UserModel,
  VehiculoModel,
} from "../database/models";
import {
  CitaAttributes,
  OrdenAttributes,
  OrdenCreationAttributes,
  VehiculoAttributes,
} from "../types";

const findAll = () => OrdenModel.findAll();

const create = (orden: OrdenCreationAttributes) => {
  // Find all users
  return OrdenModel.sequelize?.transaction((t1) => {
    return OrdenModel.create(orden);
  });
};

const update = (
  filter: WhereOptions<OrdenAttributes>,
  orden: Partial<OrdenAttributes>
) => {
  // Find all users
  return OrdenModel.sequelize?.transaction((t1) => {
    return OrdenModel.update(orden, {
      where: filter,
    });
  });
};

const getById = (IdOrdenTrabajo: number | string) => {
  // Find all users
  return OrdenModel.sequelize?.transaction((t1) => {
    return OrdenModel.findByPk(IdOrdenTrabajo, {
      include: [
        {
          model: MecanicoModel,
        },
        {
          model: VehiculoModel,
          include: [
            {
              model: MarcaModel,
            },
            {
              model: UserModel,
            },
          ],
        },
      ],
    });
  });
};

const findAllByFilter = (
  filterOrden: WhereOptions<OrdenAttributes>,
  filterVehiculo: WhereOptions<VehiculoAttributes>,
  filterCita: WhereOptions<CitaAttributes>
) => {
  // Find all users
  return OrdenModel.sequelize?.transaction((t1) => {
    return OrdenModel.findAll({
      include: [
        {
          model: VehiculoModel,
          where: filterVehiculo,
          include: [
            {
              model: MarcaModel,
            },
            {
              model: UserModel,
            },
          ],
        },
        {
          model: TallerModel,
        },
        {
          model: MecanicoModel,
        },
        {
          model: EtapaModel,
        },
        {
          model: CitaModel,
          where: filterCita,
          as: "cita",
        },
      ],
      where: filterOrden,
      //order: [["CodigoOrden"], ["createdAt", "DESC"]],
    });
  });
};

const count = (
  filter: WhereOptions<OrdenAttributes>,
  groupBy?: GroupOption,
  attributes?: FindAttributeOptions
) => {
  // Find all users
  if (groupBy) {
    return OrdenModel.sequelize?.transaction((t1) => {
      return OrdenModel.count({
        group: groupBy,
        attributes: attributes,
        where: filter,
      });
    });
  } else {
    return OrdenModel.sequelize?.transaction((t1) => {
      return OrdenModel.count({
        where: filter,
      });
    });
  }
};

export default {
  findAll,
  create,
  update,
  getById,
  findAllByFilter,
  count,
};
