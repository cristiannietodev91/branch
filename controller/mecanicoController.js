var mecanicoDAO = require("../dao/mecanicoDAO");
var HttpStatus = require("http-status-codes");

const getAllMecanicos = (req, res, next) => {
  try {
    mecanicoDAO.findAll(function (error, mecanicos) {
      if (error) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: error.errors[0] });
      } else {
        if (mecanicos) {
          res.status(HttpStatus.OK).json(mecanicos);
        }
      }
    });
  } catch (error) {
    console.error("Error al listar mecanicos ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllMecanicosByIdtaller = (req, res, next) => {
  const IdTaller = req.params.Id;

  try {
    mecanicoDAO.findAllByFilter(
      { IdTaller: IdTaller },
      { estado: "Activo" },
      function (error, mecanicos) {
        if (error) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error });
        } else {
          if (mecanicos) {
            res.status(HttpStatus.OK).json(mecanicos);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al listar mecanicos ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const createMecanico = (req, res, next) => {
  try {
    var mecanico = req.body;

    mecanicoDAO.create(mecanico, function (error, mecanico) {
      if (error) {
        console.error(
          "Error al realizar la transaccion de crear mecanico:::>",
          "error ::>",
          error
        );
        if (error.errors) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.errors[0] });
        } else {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      } else {
        if (mecanico) {
          mecanicoDAO.getById(mecanico.IdMecanico, function (error, mecanico) {
            if (error) {
              console.error(
                "Error al realizar la transaccion de crear mecanico en getByID:::>",
                "error ::>",
                error
              );
              if (error.errors) {
                return res
                  .status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({ error: error.errors[0] });
              } else {
                return res
                  .status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({ error: error.message });
              }
            } else {
              if (mecanico) {
                return res.status(HttpStatus.OK).json(mecanico);
              } else {
                return res.status(HttpStatus.OK).json({});
              }
            }
          });
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ error: "No se creo el mecanico" });
        }
      }
    });
  } catch (error) {
    console.error("Error al crear taller ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateMecanico = (req, res, next) => {
  try {
    var IdMecanico = req.params.Id;
    var mecanico = req.body;
    if (IdMecanico) {
      mecanicoDAO.update(IdMecanico, mecanico, function (error, mecanico) {
        if (error) {
          console.error(
            "Error al realizar la transaccion de actualizar Mecanico:::>",
            "error ::>",
            error.message
          );
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.errors[0] });
        } else {
          if (mecanico) {
            return res.status(HttpStatus.ACCEPTED).json({
              message:
                "Se actualizo el Mecanico " + IdMecanico + " correctamente"
            });
          } else {
            return res
              .status(HttpStatus.OK)
              .json({ error: "No se actualizo el mecanico" });
          }
        }
      });
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "El parametro IdMecanico es requerido" });
    }
  } catch (error) {
    console.error("Error al actualizar taller ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const findMecanicoById = (req, res, next) => {
  try {
    var IdMecanico = req.params.Id;
    //console.debug('Parametro de Idusuario recibido :::::>', req.params);
    mecanicoDAO.getById(IdMecanico, function (error, mecanico) {
      if (error) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.errors[0] });
      } else {
        if (mecanico) {
          return res.status(HttpStatus.OK).json(mecanico);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      }
    });
  } catch (error) {
    console.error("Error al buscar Mecanico By Id ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteCitaById = (req, res, next) => {
  try {
    var IdMecanico = req.params.Id;

    mecanicoDAO.deleteById(IdMecanico, function (error, result) {
      if (error) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error });
      } else {
        if (result) {
          return res.status(HttpStatus.ACCEPTED).json({
            message: "Se elimino el mecanico " + IdMecanico + " correctamente"
          });
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ message: "Id no encontrado" });
        }
      }
    });
  } catch (error) {
    console.error("Error al borrar Mecanico By Id ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  getAllMecanicos,
  createMecanico,
  updateMecanico,
  findMecanicoById,
  deleteCitaById,
  getAllMecanicosByIdtaller
};
