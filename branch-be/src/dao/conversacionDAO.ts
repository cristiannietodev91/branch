import { WhereOptions } from "sequelize";
import { ConversacionModel, TallerModel, UserModel } from "../database/models";
import {
  ConversationAttributes,
  ConversationCreationAttributes,
  ConversationInstance,
  UserAttributes,
} from "../types";

const findAll = (): Promise<ConversationInstance[]> =>
  ConversacionModel.findAll();

const create = (conversacion: ConversationCreationAttributes) => {
  return ConversacionModel.sequelize?.transaction((t1) => {
    return ConversacionModel.create(conversacion);
  });
};

const update = (
  IdConversacion: number,
  conversacion: Partial<ConversationAttributes>
): Promise<[affectedCount: number]> | undefined => {
  return ConversacionModel.sequelize?.transaction((t1) => {
    return ConversacionModel.update(conversacion, {
      where: { IdConversacion: IdConversacion },
    });
  });
};

const findOneByFilter = (filter: WhereOptions<ConversationAttributes>) => {
  // Find all users
  return ConversacionModel.sequelize?.transaction((t1) => {
    return ConversacionModel.findOne({
      where: filter,
    });
  });
};

const findAllByFilter = (
  filterConversacion: WhereOptions<ConversationAttributes>,
  filterUsuario?: WhereOptions<UserAttributes>
) => {
  // Find all users
  return ConversacionModel.sequelize?.transaction((t1) => {
    return ConversacionModel.findAll({
      include: [
        {
          model: UserModel,
          where: filterUsuario,
        },
        {
          model: TallerModel,
        },
      ],
      where: filterConversacion,
    });
  });
};

const findPaginateByFilter = (
  page: number,
  limit: number,
  filterConversacion: WhereOptions<ConversationAttributes> | undefined
): Promise<{ rows: ConversationInstance[]; count: number }> | undefined => {
  const options = {
    limit,
    offset: page,
    include: [
      {
        model: UserModel,
      },
      {
        model: TallerModel,
      },
    ],
    where: filterConversacion,
  };
  // Find all users
  return ConversacionModel.sequelize?.transaction((t1) => {
    return ConversacionModel.findAndCountAll(options);
  });
};

export default {
  create,
  update,
  findAll,
  findOneByFilter,
  findAllByFilter,
  findPaginateByFilter,
};
