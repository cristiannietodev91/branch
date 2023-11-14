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

const create = (cita: CitaCreationAttributes): Promise<CitaInstance> => {
  return CitaModel.create(cita).then((cita) => {
    return cita;
  });
};

const update = (
  IdCita: number,
  cita: Partial<CitaCreationAttributes>
): Promise<[affectedCount: number]> => {
  return CitaModel.update(cita, {
    where: { IdCita: IdCita },
  });
};

const getById = (IdCita: number): Promise<CitaInstance | null> => {
  return CitaModel.findByPk(IdCita, {
    include: [
      {
        model: VehiculoModel,
        include: [
          {
            model: MarcaModel,
            required: true
          },
          {
            model: UserModel,
            required: true
          },
        ],
      },
      {
        model: TallerModel,
        required: true,
      },
      {
        model: MecanicoModel,
      },
    ],
  });
};

const deleteById = (IdCita: number): Promise<number> => {
  return CitaModel.destroy({
    where: { IdCita: IdCita },
  });
};

const findAllByFilter = (
  filterCita: WhereOptions<CitaAttributes> = {},
  filterVehiculo: WhereOptions<VehiculoAttributes> = {},
  filterOrden: WhereOptions<OrdenAttributes> = {}
): Promise<CitaInstance[]> => {
  return CitaModel.findAll({
    include: [
      {
        model: VehiculoModel,
        required: true,
        where: filterVehiculo,
        include: [
          {
            model: MarcaModel,
            required: true
          },
          {
            model: UserModel,
            required: true
          },
        ],
      },
      {
        model: TallerModel,
        required: true
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
};

const count = (
  filter?: WhereOptions<CitaAttributes>,
  groupBy?: GroupOption,
  attributes?: FindAttributeOptions
): Promise<GroupedCountResultItem[]> | Promise<number> => {
  if (groupBy) {
    return CitaModel.count({
      group: groupBy,
      attributes: attributes,
      where: filter,
    });
  } else {
    return CitaModel.count({
      where: filter,
    });
  }
};

const truncate = async (): Promise<void> => {
  await CitaModel.truncate({ restartIdentity: true });
};

export default {
  findAll,
  create,
  update,
  deleteById,
  findAllByFilter,
  getById,
  count,
  truncate,
};
