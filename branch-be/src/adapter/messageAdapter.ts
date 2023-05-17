import messageDAO from "../dao/messageDAO";
import conversacionDAO from "../dao/conversacionDAO";
import { OrderItem, WhereOptions } from "sequelize";
import {
  ConversationAttributes,
  ConversationInstance,
  MessageCreationAttributes,
  MessageInstance,
} from "../types";

const createMessage = (message: MessageCreationAttributes) => {
  return messageDAO.create(message);
};

const getMessagesByConversacion = (
  conversacion: WhereOptions<ConversationAttributes>,
  order: OrderItem = ["IdMessage", "DESC"]
) => {
  return new Promise<MessageInstance[]>((resolve, rejected) => {
    conversacionDAO
      .findOneByFilter(conversacion)
      ?.then((conversacion) => {
        if (conversacion && conversacion.IdConversacion) {
          messageDAO
            .findAllByFilter(
              {
                IdConversacion: conversacion.IdConversacion,
              },
              order
            )
            ?.then((messages) => {
              resolve(messages);
            });
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        rejected(error);
      });
  });
};

const getAllConversationsUnread = (IdTaller: string | number) => {
  return new Promise<ConversationInstance[]>((resolve, reject) => {
    messageDAO
      .findDistinctAllByFilter({ read: false, typeusuario: "cliente" })
      ?.then((messages) => {
        const Ids = messages.map((a) => a.IdConversacion);

        const filter: WhereOptions<ConversationAttributes> = {
          IdTaller: IdTaller,
          IdConversacion: Ids,
        };
        conversacionDAO
          .findAllByFilter(filter)
          ?.then((conversaciones) => {
            resolve(conversaciones);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 *
 * @param {*} IdConversacion
 * @param {*} cb
 */
const markallMessagesRead = (
  conversacion: WhereOptions<ConversationAttributes>,
  typeusuario: string | number
) => {
  return new Promise((resolve, rejected) => {
    conversacionDAO
      .findOneByFilter(conversacion)
      ?.then((conversacion) => {
        if (conversacion && conversacion.IdConversacion) {
          messageDAO
            .update(
              {
                IdConversacion: conversacion.IdConversacion,
                read: false,
                typeusuario: typeusuario,
              },
              { read: true }
            )
            ?.then((result) => {
              resolve(result);
            })
            .catch((error) => {
              rejected(error);
            });
        } else {
          rejected(new Error("Messages were not updated"));
        }
      })
      .catch((error) => {
        rejected(error);
      });
  });
};

const countMessagesUnReadByIdConversacion = (
  IdConversacion: string | number,
  typeusuario?: string
) => {
  return messageDAO.count({
    IdConversacion: IdConversacion,
    typeusuario: typeusuario,
    read: false,
  });
};

export default {
  createMessage,
  getMessagesByConversacion,
  markallMessagesRead,
  getAllConversationsUnread,
  countMessagesUnReadByIdConversacion,
};
