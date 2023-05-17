import conversacionDAO from "../dao/conversacionDAO";
import { Op } from "sequelize";
import { ConversationCreationAttributes, ConversationInstance } from "../types";
import Debug from "debug";
const debug = Debug("branch:server");

const createConversacion = (conversacion: ConversationInstance) => {
  return conversacionDAO.create(conversacion);
};

const createOrGetConversacion = (
  paramconversacion: ConversationCreationAttributes
) => {
  debug("Conversacion param :::>", paramconversacion);
  return new Promise<ConversationInstance>((resolve, rejected) => {
    conversacionDAO
      .findOneByFilter(paramconversacion)
      ?.then((conversacion) => {
        if (conversacion && conversacion.IdConversacion) {
          resolve(conversacion);
        } else {
          conversacionDAO
            .create(paramconversacion)
            ?.then((conversacion) => {
              resolve(conversacion);
            })
            .catch((error) => {
              rejected(error);
            });
        }
      })
      .catch((error) => {
        rejected(error);
      });
  });
};

const getConversacionesByTallerAndNombreUsuario = (
  IdTaller: string | number,
  nombreUsuario?: string
) => {
  return conversacionDAO.findAllByFilter(
    { IdTaller: IdTaller },
    { firstName: { [Op.substring]: nombreUsuario } }
  );
};

export default {
  createConversacion,
  createOrGetConversacion,
  getConversacionesByTallerAndNombreUsuario,
};
