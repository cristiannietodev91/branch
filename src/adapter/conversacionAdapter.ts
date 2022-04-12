import conversacionDAO from "../dao/conversacionDAO";
import { Op } from "sequelize";
import { ConversationInstance } from "../types";
import Debug from "debug";
const debug = Debug("branch:server");

const createConversacion = (conversacion: ConversationInstance) => {
  return conversacionDAO.create(conversacion);
};

const createOrGetConversacion = (paramconversacion: ConversationInstance) => {
  debug("Conversacion parama :::>", paramconversacion);
  return new Promise((resolve, rejected) => {
    conversacionDAO
      .findOneByFilter({ $IdConversacion$: 1 })
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

const getConversacionesByTallerAndNombreUsuario = (IdTaller: string | number, nombreUsuario?: string) => {
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
