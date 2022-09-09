import {
  FindAttributeOptions,
  GroupedCountResultItem,
  GroupOption,
  WhereOptions,
} from "sequelize";
import {
  CitaModel,
  MarcaModel,
  MecanicoModel,
  OrdenModel,
  TallerModel,
  UserModel,
  VehiculoModel,
} from "../database/models";
import {
  CitaAttributes,
  CitaCreationAttributes,
  CitaInstance,
  OrdenAttributes,
  VehiculoAttributes,
} from "../types";

const findAll = (): Promise<CitaInstance[]> => CitaModel.findAll();

const create = (cita: CitaCreationAttributes): Promise<CitaInstance> | undefined => {
  // Find all users
  return CitaModel.sequelize?.transaction(() => {
    return CitaModel.create(cita).then((cita) => {
      return cita;
    });
  });
};

const update = (
  IdCita: string | number,
  cita: Partial<CitaCreationAttributes>
): Promise<[affectedCount: number]> | undefined => {
  // Find all users
  return CitaModel.sequelize?.transaction((t1) => {
    return CitaModel.update(cita, {
      where: { IdCita: IdCita },
    });
  });
};

const getById = (IdCita: string | number): Promise<CitaInstance | null> | undefined => {
  // Find all users
  return CitaModel.sequelize?.transaction((t1) => {
    return CitaModel.findByPk(IdCita, {
      include: [
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
        {
          model: TallerModel,
        },
        {
          model: MecanicoModel,
        },
      ],
    });
  });
};

const deleteById = (IdCita: string | number): Promise<number> | undefined => {
  // Find all users
  return CitaModel.sequelize?.transaction((t1) => {
    return CitaModel.destroy({
      where: { IdCita: IdCita },
    }).then((deleted) => {
      return deleted;
    });
  });
};

const findAllByFilter = (
  filterCita: WhereOptions<CitaAttributes>,
  filterVehiculo: WhereOptions<VehiculoAttributes>,
  filterOrden: WhereOptions<OrdenAttributes>
): Promise<CitaInstance[]> | undefined => {
  // Find all users
  return CitaModel.sequelize?.transaction((t1) => {
    return CitaModel.findAll({
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
          model: OrdenModel,
          where: filterOrden,
          include: [
            {
              model: MecanicoModel,
              required: false,
            },
          ],
          required: false,
        },
      ],
      where: filterCita,
      order: [
        ["fechaCita", "DESC"],
        ["horaCita", "DESC"],
        [OrdenModel, "IdEtapa"],
      ],
    });
  });
};

const count = (
  filter?: WhereOptions<CitaAttributes>,
  groupBy?: GroupOption,
  attributes?: FindAttributeOptions
): Promise<GroupedCountResultItem[]> | Promise<number> | undefined => {
  // Find all users
  if (groupBy) {
    return CitaModel.sequelize?.transaction((t1) => {
      return CitaModel.count({
        group: groupBy,
        attributes: attributes,
        where: filter,
      });
    });
  } else {
    return CitaModel.sequelize?.transaction((t1) => {
      return CitaModel.count({
        where: filter,
      });
    });
  }
};

export default {
  findAll,
  create,
  update,
  deleteById,
  findAllByFilter,
  getById,
  count
}
