import {
  FindAttributeOptions,
  GroupOption,
  WhereOptions,
} from "sequelize";
import {
  MarcaModel,
  MecanicoModel,
  NotificacionModel,
  UserModel,
  VehiculoModel,
} from "../database/models";
import { NotificationAttributes, NotificationInstance, NotificationCreationAttributes } from "../types";

const findAll = (): Promise<NotificationInstance[]> =>
  // Find all users
  NotificacionModel.findAll();

const create = (
  notificacion: NotificationCreationAttributes
): Promise<NotificationInstance> | undefined => {
  // Find all users
  return NotificacionModel.sequelize?.transaction((t1) => {
    return NotificacionModel.create(notificacion);
  });
};

const update = (
  filterNotificacion: WhereOptions<NotificationAttributes>,
  notificacion: Partial<NotificationAttributes>
) => {
  // Find all users
  return NotificacionModel.sequelize?.transaction((t1) => {
    return NotificacionModel.update(notificacion, {
      where: filterNotificacion,
    });
  });
};

const getById = (IdOrdenTrabajo: number) => {
  // Find all users
  return NotificacionModel.sequelize?.transaction((t1) => {
    return NotificacionModel.findByPk(IdOrdenTrabajo, {
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

const deleteById = (filter: WhereOptions<NotificationAttributes>) => {
  // Find all users
  return NotificacionModel.sequelize?.transaction((t1) => {
    return NotificacionModel.destroy({
      where: filter,
    });
  });
};

const findAllByFilter = (
  filterNotificacion: WhereOptions<NotificationAttributes>
) => {
  // Find all users
  return NotificacionModel.sequelize?.transaction((t1) => {
    return NotificacionModel.findAll({
      where: filterNotificacion,
      limit: 10,
      order: [["createdAt", "DESC"]],
    });
  });
};

const count = (
  filter: WhereOptions<NotificationAttributes>,
  groupBy?: GroupOption,
  attributes?: FindAttributeOptions
) => {
  // Find all users
  if (groupBy) {
    return NotificacionModel.sequelize?.transaction((t1) => {
      return NotificacionModel.count({
        group: groupBy,
        attributes: attributes,
        where: filter,
      });
    });
  } else {
    return NotificacionModel.sequelize?.transaction((t1) => {
      return NotificacionModel.count({
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
  deleteById,
  findAllByFilter,
  count
}
