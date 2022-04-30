import mecanicoDAO from "../dao/mecanicoDAO";
// import mecanicoAdapter from "../adapter/mecanicoAdapter";
import HttpStatus from "http-status-codes";
import { Request, Response } from "express";

const getAllMecanicos = (req: Request, res: Response): void => {
  try {
    mecanicoDAO
      .findAll()
      .then((mecanicos) => {
        if (mecanicos) {
          res.status(HttpStatus.OK).json(mecanicos);
        }
      })
      .catch((error) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al listar mecanicos ::::::>", error);
    if (error instanceof Error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllMecanicosByIdtaller = (req: Request, res: Response) => {
  const IdTaller = req.params.Id;

  try {
    mecanicoDAO
      .findAllByFilter({ IdTaller: IdTaller }, { estado: "Activo" })
      ?.then((mecanicos) => {
        if (mecanicos) {
          res.status(HttpStatus.OK).json(mecanicos);
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: error });
      });
  } catch (error) {
    console.error("Error al listar mecanicos ::::::>", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const createMecanico = (req: Request, res: Response) => {
  try {
    const mecanico = req.body;

    mecanicoDAO
      .create(mecanico)
      ?.then((mecanico) => {
        if (mecanico) {
          mecanicoDAO
            .getById(mecanico.IdMecanico)
            ?.then((mecanico) => {
              if (mecanico) {
                return res.status(HttpStatus.OK).json(mecanico);
              } else {
                return res.status(HttpStatus.OK).json({});
              }
            })
            .catch((error) => {
              return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: error.message });
            });
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ error: "No se creo el mecanico" });
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al crear taller ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const updateMecanico = (req: Request, res: Response) => {
  try {
    const IdMecanico = req.params.Id;
    const mecanico = req.body;
    if (IdMecanico) {
      mecanicoDAO
        .update(IdMecanico, mecanico)
        ?.then((result) => {
          if (result) {
            return res.status(HttpStatus.ACCEPTED).json({
              message:
                "Se actualizo el Mecanico " + IdMecanico + " correctamente",
            });
          } else {
            return res
              .status(HttpStatus.OK)
              .json({ error: "No se actualizo el mecanico" });
          }
        })
        .catch((error) => {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        });
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "El parametro IdMecanico es requerido" });
    }
  } catch (error) {
    console.error("Error al actualizar taller ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const findMecanicoById = (req: Request, res: Response) => {
  try {
    const IdMecanico = req.params.Id;
    //console.debug('Parametro de Idusuario recibido :::::>', req.params);
    mecanicoDAO
      .getById(IdMecanico)
      ?.then((mecanico) => {
        if (mecanico) {
          return res.status(HttpStatus.OK).json(mecanico);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al buscar Mecanico By Id ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const deleteCitaById = (req: Request, res: Response) => {
  try {
    const IdMecanico = req.params.Id;

    mecanicoDAO
      .deleteById(IdMecanico)
      ?.then((result) => {
        if (result) {
          return res.status(HttpStatus.ACCEPTED).json({
            message: "Se elimino el mecanico " + IdMecanico + " correctamente",
          });
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ message: "Id no encontrado" });
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error });
      });
  } catch (error) {
    console.error("Error al borrar Mecanico By Id ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

export default {
  getAllMecanicos,
  createMecanico,
  updateMecanico,
  findMecanicoById,
  deleteCitaById,
  getAllMecanicosByIdtaller,
};
