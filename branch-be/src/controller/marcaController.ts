import marcaDAO from "../dao/marcaDAO";
import HttpStatus from "http-status-codes";
import { Request, Response } from "express";

const getAllMarcas = (req: Request, res: Response) => {
  try {
    marcaDAO
      .findAll()
      .then((marcas) => {
        if (marcas) {
          res.status(HttpStatus.OK).json(marcas);
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al listar marcas ::::::>", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getListUniqueMarcas = (req: Request, res: Response) => {
  try {
    marcaDAO
      .findAllUnique()
      .then((marcas) => {
        if (marcas) {
          res.status(HttpStatus.OK).json(marcas);
        }
      })
      .catch((error) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: error.message });
      });
  } catch (error) {
    console.error("Error al listar marcas ::::::>", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllMarcaByMarca = (req: Request, res: Response) => {
  try {
    const marca = req.params.marca;

    marcaDAO
      .findAllByFilter({ marca: marca })
      ?.then((marcas) => {
        if (marcas) {
          res.status(HttpStatus.OK).json(marcas);
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al listar marcas ::::> ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const createMarca = (req: Request, res: Response) => {
  try {
    const marca = req.body;
    console.debug("Parametro de marca recibido :::::>", marca);
    marcaDAO
      .create(marca)
      ?.then((marca) => {
        if (marca) {
          marcaDAO
            .getById(marca.IdMarca)
            ?.then((marca) => {
              if (marca) {
                return res.status(HttpStatus.OK).json(marca);
              } else {
                return res.status(HttpStatus.OK).json({});
              }
            })
            .catch((error) => {
              return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: error.errors[0] });
            });
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ error: "No se creo la marca" });
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      });
  } catch (error) {
    console.error("Error al crear marca ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const updateMarca = (req: Request, res: Response) => {
  try {
    const IdMarca = req.params.Id;
    const marca = req.body;
    if (IdMarca) {
      marcaDAO
        .update(IdMarca, marca)
        ?.then((result) => {
          if (result) {
            return res.status(HttpStatus.ACCEPTED).json({
              message: "Se actualizo la marca " + IdMarca + " correctamente",
            });
          } else {
            return res
              .status(HttpStatus.OK)
              .json({ error: "No se actualizo la marca" });
          }
        })
        .catch((error) => {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.errors[0] });
        });
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "El parametro IdMarca es requerido" });
    }
  } catch (error) {
    console.error("Error al actualizar marca ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const deleteMarcaById = (req: Request, res: Response) => {
  try {
    const IdMarca = req.params.Id;
    console.debug("Parametro de IdMarca recibido :::::>", IdMarca);
    if (IdMarca) {
      marcaDAO
        .deleteById(IdMarca)
        ?.then((result) => {
          if (result) {
            return res.status(HttpStatus.ACCEPTED).json({
              message: "Se elimino la IdMarca " + IdMarca + " correctamente",
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
            .json({ error: error.errors[0] });
        });
    }
  } catch (error) {
    console.error("Error al borrar Marca By Id ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const findMarcaById = (req: Request, res: Response) => {
  try {
    const IdMarca = req.params.Id;
    //console.debug('Parametro de Idusuario recibido :::::>', req.params);
    marcaDAO
      .getById(IdMarca)
      ?.then((marca) => {
        if (marca) {
          return res.status(HttpStatus.OK).json(marca);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      })
      .catch((error) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.errors[0] });
      });
  } catch (error) {
    console.error("Error al buscar Marca By Id ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

export default {
  getAllMarcas,
  getAllMarcaByMarca,
  getListUniqueMarcas,
  createMarca,
  updateMarca,
  deleteMarcaById,
  findMarcaById,
};
