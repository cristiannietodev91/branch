import ordenDAO from "../dao/ordenDAO";
import { Op } from "sequelize";

const getOrdenesByIdTallerAndFilter = (
  IdTaller: string | number,
  filter?: string
) => {
  return ordenDAO.findAllByFilter(
    {
      IdTaller: IdTaller,
      CodigoOrden: {
        [Op.substring]: filter,
      },
    },
    {},
    {}
  );
};

const getOrdenesByIdTallerActivas = (IdTaller: string | number) => {
  return ordenDAO.findAllByFilter(
    {
      IdTaller: IdTaller,
    },
    {},
    { estado: "cumplida" }
  );
};

const getOrdenesByIdTallerAndIdCita = (IdTaller: number | string, IdCita?: number) => {
  return ordenDAO.findAllByFilter(
    {
      IdTaller: IdTaller,
      IdCita: IdCita,
    },
    {},
    {}
  );
};

const countOrdenesByIdTaller = (IdTaller: number | string) => {
  return ordenDAO.count({ IdTaller: IdTaller });
};

const countOrdenesByEstadoIdTaller = (IdTaller: number) => {
  return ordenDAO.count({ IdTaller: IdTaller }, ["estado"]);
};

export default {
  getOrdenesByIdTallerAndFilter,
  getOrdenesByIdTallerAndIdCita,
  countOrdenesByIdTaller,
  countOrdenesByEstadoIdTaller,
  getOrdenesByIdTallerActivas,
};
