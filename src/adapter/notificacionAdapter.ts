import notificacionDAO from "../dao/notificacionDAO";
import { Op } from "sequelize";
import { NotificationCreationAttributes } from "../types";

const crearNotificacion = (notificacion: NotificationCreationAttributes) => {
  const notificacionDb: NotificationCreationAttributes = {
    IdUsuario: notificacion.IdUsuario,
    text: notificacion.text,
    typenotificacion: notificacion.typenotificacion,
    read: notificacion.read,
    dataAdicional: notificacion.dataAdicional,
  };
  return notificacionDAO.create(notificacionDb);
};

const findNotificacionesByIdUsuario = (IdUsuario: string | number) => {
  return notificacionDAO.findAllByFilter({ IdUsuario: IdUsuario });
};

const countNotificacionesByIdUsuario = (IdUsuario: string | number) => {
  return notificacionDAO.count({ IdUsuario: IdUsuario, read: false });
};

const updateNotificacionGeneralByIdUsuario = (IdUsuario: string | number) => {
  return notificacionDAO.update(
    {
      IdUsuario: IdUsuario,
      read: false,
      typenotificacion: { [Op.ne]: "Calificación" },
    },
    { read: true });
};

const updateNotificacionByIdNotificacion = (
  IdNotificacion: string | number,
  IdCita: string | number,
  calificacion: number
) => {
  return notificacionDAO.update(
    {
      IdNotificacion: IdNotificacion,
    },
    {
      read: true,
      dataAdicional: {
        IdCita: IdCita,
        calificada: true,
        calificacion: calificacion,
      },
    }
  );
};

export default {
  crearNotificacion,
  findNotificacionesByIdUsuario,
  updateNotificacionGeneralByIdUsuario,
  updateNotificacionByIdNotificacion,
  countNotificacionesByIdUsuario,
};
