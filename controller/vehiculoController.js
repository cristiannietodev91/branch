const vehiculoDAO = require("../dao/vehiculoDAO");
const marcaDAO = require("../dao/marcaDAO");
let sms = require("../utils/sendSms");
let HttpStatus = require("http-status-codes");
const { Op } = require("sequelize");
let userAdapter = require("../adapter/userAdapter");
let vehiculoAdapter = require("../adapter/vehiculoAdapter");
let moment = require("moment");

moment.locale("es");

const getAllVehiculos = (req, res, next) => {
  try {
    vehiculoDAO.findAll(function (error, vehiculos) {
      if (error) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: error.errors[0] });
      } else {
        if (vehiculos) {
          res.status(HttpStatus.OK).json(vehiculos);
        }
      }
    });
  } catch (error) {
    console.error("Error al crear vehiculo ::::::>", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const createVehiculo = (req, res, next) => {
  try {
    let vehiculo = req.body;
    console.debug("Parametro de vehiculo recibido :::::>", vehiculo);

    vehiculoDAO.findOneByFilter({ placa: vehiculo.placa }, function (
      error,
      vehiculoResult
    ) {
      if (error) {
        console.error(
          "Error al buscar vehiculo por placa:::>",
          "error ::>",
          error.message
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
        console.log("Resultado find by Placa ::::>", vehiculoResult);
        if (vehiculoResult) {
          //TODO : Placa ya existe, si no tiene taller si coloca el ID de taller que esta registrando
        } else {
          //Valida si usuario ya existe
          console.log("Resultado find by Placa ::::>", vehiculoResult);
          userAdapter.findUserByEmail(
            vehiculo.usuario.email,
            (error, usuario) => {
              if (error) {
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
                if (usuario) {
                  //Encontro un usuario
                  let fechaCompraBD = vehiculo.fechaCompraText
                    ? moment(vehiculo.fechaCompraText, "DD/MM/YYYY")
                    : null;

                  console.log(
                    "Fecha compra valor para BD ",
                    vehiculo.fechaCompraText,
                    " Valor ::>",
                    fechaCompraBD
                  );

                  let vehiculoDB = {
                    alias: vehiculo.alias,
                    color: vehiculo.color,
                    fechaCompra: fechaCompraBD,
                    fotos: vehiculo.fotos,
                    kilometraje: vehiculo.kilometraje,
                    marca: vehiculo.marca,
                    modelo: vehiculo.modelo,
                    placa: vehiculo.placa,
                    tipoVehiculo: vehiculo.tipoVehiculo,
                    IdTaller: vehiculo.IdTaller,
                  };

                  vehiculoAdapter.crearVehiculo(usuario, vehiculoDB, function (
                    error,
                    vehiculo
                  ) {
                    if (error) {
                      console.error(
                        "Error al realizar la transaccion de crear vehiculo con usuario existente:::>",
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
                      if (vehiculo) {
                        return res.status(HttpStatus.OK).json(vehiculo);
                      } else {
                        return res
                          .status(HttpStatus.INTERNAL_SERVER_ERROR)
                          .json({
                            error: "Error indefinido al crear vehiculo",
                          });
                      }
                    }
                  });
                } else {
                  //No Encontro usuario lo va a crear
                  let usuario = {
                    email: vehiculo.email,
                    celular: "+57" + vehiculo.celular,
                    password: "123456",
                    fullname: "Sin nombre",
                    tipoUsuario: "Cliente",
                  };

                  userAdapter.createUsuario(usuario, function (
                    error,
                    userRecord
                  ) {
                    if (error) {
                      console.error(
                        "Error al realizar la transaccion de crear vehiculo:::>",
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
                      if (userRecord) {
                        //Encontro un usuario
                        let fechaCompraBD = vehiculo.fechaCompraText
                          ? moment(vehiculo.fechaCompraText, "DD/MM/YYYY")
                          : null;

                        let vehiculoDB = {
                          alias: vehiculo.alias,
                          color: vehiculo.color,
                          fechaCompra: fechaCompraBD,
                          fotos: vehiculo.fotos,
                          kilometraje: vehiculo.kilometraje,
                          marca: vehiculo.marca,
                          modelo: vehiculo.modelo,
                          placa: vehiculo.placa,
                          tipoVehiculo: vehiculo.tipoVehiculo,
                          IdTaller: vehiculo.IdTaller,
                        };

                        vehiculoAdapter.crearVehiculo(
                          userRecord,
                          vehiculoDB,
                          function (error, vehiculo) {
                            if (error) {
                              console.error(
                                "Error al realizar la transaccion de crear vehiculo con usuario existente:::>",
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
                              if (vehiculo) {
                                return res.status(HttpStatus.OK).json(vehiculo);
                              } else {
                                return res
                                  .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                  .json({
                                    error: "Error indefinido al crear vehiculo",
                                  });
                              }
                            }
                          }
                        );
                      }
                    }
                  });
                }
              }
            }
          );
        }
      }
    });
  } catch (error) {
    console.error("Error al crear vehiculo ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateVehiculo = (req, res, next) => {
  try {
    var IdVehiculo = req.params.Id;
    var vehiculo = req.body;
    console.debug(
      "Parametro de vehiculo recibido para actualizar :::::>",
      vehiculo
    );
    if (IdVehiculo) {
      marcaDAO.findOneByFilter(
        { marca: vehiculo.marca.marca, referencia: vehiculo.marca.referencia },
        (error, marca) => {
          if (error) {
            console.log("Error al actualizar el vehiculo :::>", error);
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: error });
          } else {
            if (marca) {
              var vehiculoUpdate = {
                IdMarca: marca.IdMarca,
                IdUsuario: vehiculo.usuario.uid,
                IdTaller: vehiculo.IdTaller,
                tipoVehiculo: "Moto",
                placa: vehiculo.placa,
                estado: "Pendiente",
                alias: vehiculo.alias,
                color: vehiculo.color,
                fechaCompra: vehiculo.fechaCompra,
                kilometraje: vehiculo.kilometraje,
                modelo: vehiculo.modelo,
                fotos: vehiculo.fotos,
                soat: vehiculo.soat,
                tecnomecanica: vehiculo.tecnomecanica,
              };

              vehiculoDAO.update(IdVehiculo, vehiculoUpdate, function (
                error,
                vehiculo
              ) {
                if (error) {
                  console.error(
                    "Error al realizar la transaccion de actualizar vehiculo:::>",
                    "error ::>",
                    error.message
                  );
                  return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ error: error.errors[0] });
                } else {
                  if (vehiculo) {
                    return res.status(HttpStatus.ACCEPTED).json({
                      message:
                        "Se actualizo el Vehiculo " +
                        IdVehiculo +
                        " correctamente",
                    });
                  } else {
                    return res
                      .status(HttpStatus.OK)
                      .json({ error: "No se actualizo el vehiculo" });
                  }
                }
              });
            }
          }
        }
      );
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "El parametro IdVehiculo es requerido" });
    }
  } catch (error) {
    console.error("Error al actualizar vehiculo ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteVehiculoById = (req, res, next) => {
  try {
    var IdVehiculo = req.params.Id;
    console.debug("Parametro de IdVehiculo recibido :::::>", IdVehiculo);
    vehiculoDAO.deleteById(IdVehiculo, function (error, result) {
      if (error) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.errors[0] });
      } else {
        if (result) {
          return res.status(HttpStatus.ACCEPTED).json({
            message:
              "Se elimino el IdVehiculo " + IdVehiculo + " correctamente",
          });
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ message: "Id no encontrado" });
        }
      }
    });
  } catch (error) {
    console.error("Error al borrar Vehiculo By Id ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const findVehiculoById = (req, res, next) => {
  try {
    var IdVehiculo = req.params.Id;
    //console.debug('Parametro de Idusuario recibido :::::>', req.params);
    vehiculoDAO.getById(IdVehiculo, function (error, vehiculo) {
      if (error) {
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
        if (vehiculo) {
          return res.status(HttpStatus.OK).json(vehiculo);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      }
    });
  } catch (error) {
    console.error("Error al buscar Vehiculo By Id ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllVehiculosByIdTaller = (req, res, next) => {
  try {
    let IdTaller = req.params.Id;
    console.debug("Parametro taller recibido :::::>", req.query);

    vehiculoDAO.findAllByFilter({ IdTaller: IdTaller }, function (
      error,
      vehiculos
    ) {
      if (error) {
        console.error(
          "Error al realizar la transaccion de buscar vehiculos por taller:::>",
          "error ::>",
          error.message
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
        if (vehiculos) {
          res.status(HttpStatus.OK).json(vehiculos);
        }
      }
    });
  } catch (error) {
    console.error("Error al listar vehiculos ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getVehiculoByPlaca = (req, res, next) => {
  try {
    let placa = req.params.placa;
    console.debug("Parametro de palca recibido :::::>", placa);
    vehiculoDAO.findOneByFilter({ placa: placa }, function (
      error,
      vehiculoResult
    ) {
      if (error) {
        console.error(
          "Error al buscar vehiculo por placa:::>",
          "error ::>",
          error.message
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
        res.status(HttpStatus.OK).json(vehiculoResult);
      }
    });
  } catch (error) {
    console.error("Error al listar vehiculos ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllPaginateFilterVehiculosByIdTaller = (req, res, next) => {
  try {
    let page = req.query.page;
    let perpage = parseInt(req.query.perPage);
    let columnFilter = req.query.columnFilter;
    let valueSearch = req.query.filter;
    let IdTaller = req.params.Id;

    let filterVehiculo = {};
    let filterUsuario = {};

    if (columnFilter == "placa") {
      if (valueSearch) {
        filterVehiculo = {
          IdTaller: IdTaller,
          placa: {
            [Op.substring]: valueSearch,
          },
        };
      } else {
        filterVehiculo = {
          IdTaller: IdTaller,
        };
      }
    } else {
      filterVehiculo = {
        IdTaller: IdTaller,
      };
      if (columnFilter == "firstName" || columnFilter == "identificacion") {
        if (valueSearch) {
          filterUsuario = {
            IdTaller: IdTaller,
            [columnFilter]: {
              [Op.substring]: valueSearch,
            },
          };
        } else {
          filterUsuario = {};
        }
      }
    }

    console.debug("Parametro taller recibido :::::>", req.query);

    vehiculoDAO.findPaginateByFilter(
      page,
      perpage,
      filterVehiculo,
      filterUsuario,
      function (error, vehiculos) {
        if (error) {
          console.error(
            "Error al realizar la transaccion de buscar vehiculos paginados:::>",
            "error ::>",
            error.message
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
          if (vehiculos) {
            res.status(HttpStatus.OK).json(vehiculos);
          }
        }
      }
    );
  } catch (error) {
    console.error("Error al listar vehiculos ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllVehiculosByIdUsuario = (req, res, next) => {
  try {
    var IdUsuario = req.params.Id;
    vehiculoDAO.findAllByFilter({ IdUsuario: IdUsuario }, function (
      error,
      vehiculos
    ) {
      if (error) {
        console.error(
          "Error al realizar la transaccion de buscar vehiculos por usuario:::>",
          "error ::>",
          error.message
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
        if (vehiculos) {
          res.status(HttpStatus.OK).json(vehiculos);
        }
      }
    });
  } catch (error) {
    console.error("Error al listar vehiculos ", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  getAllVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculoById,
  findVehiculoById,
  getAllVehiculosByIdTaller,
  getAllVehiculosByIdUsuario,
  getAllPaginateFilterVehiculosByIdTaller,
  getVehiculoByPlaca,
};
