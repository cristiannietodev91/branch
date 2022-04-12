import { FindAttributeOptions, Order, WhereOptions } from "sequelize";
import { MessageModel } from "../database/models";
import { MessageAttributes, MessageCreationAttributes, MessageInstance } from "../types";

const findAll = () => MessageModel.findAll();

const create = (
  message: MessageCreationAttributes
): Promise<MessageInstance> | undefined =>
  MessageModel.sequelize?.transaction((t1) => MessageModel.create(message));

const update = (
  filter: WhereOptions<MessageInstance>,
  message: Partial<MessageInstance>
) => {
  // Find all users
  return MessageModel.sequelize?.transaction((t1) => {
    return MessageModel.update(message, {
      where: filter,
    });
  });
};

const findAllByFilter = (
  filterMessages: WhereOptions<MessageAttributes>,
  order: Order
): Promise<MessageInstance[]> | undefined => {
  // Find all users
  return MessageModel.sequelize?.transaction((t1) => {
    return MessageModel.findAll({
      where: filterMessages,
      //order: [["createdAt", order ? order : "DESC"]],
      //TODO: Validate type
    });
  });
};

const findDistinctAllByFilter = (
  filterMessages: WhereOptions<MessageAttributes>,
  attributes?: FindAttributeOptions
) => {
  // Find all users
  return MessageModel.sequelize?.transaction((t1) => {
    return MessageModel.findAll({
      attributes: attributes,
      where: filterMessages,
    });
  });
};

const count = (filter: WhereOptions<MessageAttributes>) => {
  return MessageModel.sequelize?.transaction((t1) => {
    return MessageModel.count({
      where: filter,
    });
  });
};

export default {
  findAll,
  create,
  update,
  findAllByFilter,
  findDistinctAllByFilter,
  count
}
