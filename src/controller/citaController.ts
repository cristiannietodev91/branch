import citaAdapter from "../adapter/citaAdapter";
import HttpStatus from "http-status-codes";
import moment from "moment";
import Debug from "debug";
import { Request, Response } from "express";
import { CitaInstance, CitaRequestAttributes, Events } from "../types";

const { Op } = require("sequelize");
const debug = Debug("branch:server");

moment.locale("es");

const castCitasToEvents = (citas: CitaInstance[]) => {
  let events: Events[] = [];
  citas.forEach((cita) => {
    const dataCita = cita;

    let hour: Date;
    if (cita.horaCita) {
      hour = moment(cita.horaCita, "HH:mm:ss").toDate();
    } else {
      hour = moment("00:00:00", "HH:mm:ss").toDate();
    }

    let myDate = new Date(
      Date.UTC(
        dataCita.fechaCita.getFullYear(),
        dataCita.fechaCita.getMonth(),
        dataCita.fechaCita.getDate(),
        hour.getHours(),
        hour.getMinutes(),
        0
      )
    );

    let classEstado = (estado: string) => {
      switch (estado) {
        case "Solicitada":
          return "event-solicitado";
        case "Confirmada":
          return "event-confirmada";
        case "Cumplida":
          return "event-cumplida";
        case "Cancelada":
          return "event-cancelada";
        case "Incumplida":
          return "event-incumplida";
        default:
          "event-default";
      }
    };

    let event = {
      id: dataCita.IdCita,
      startDate: myDate,
      title: "Cita vehiculo =>" + dataCita.vehiculo?.placa,
      classes: classEstado(dataCita.estado),
      citaObject: dataCita,
      estado: dataCita.estado,
    };
    events.push(event);
  });
  return events;
};

const getAllCitas = (req: Request, res: Response) => {
  try {
    citaAdapter
      .findAll()
      .then((citas) => {
        res.status(HttpStatus.OK).json(citas);
      })
      .catch((error) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: error.errors[0] });
      });
  } catch (error) {
    console.error("Error al obtener cita ::::::>", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const createCita = (req: Request, res: Response) => {
  try {
    const cita = req.body;
    debug("Parametro de cita recibido :::::>", cita);

    const citaToCreate: CitaRequestAttributes = {
      placa: cita.placa,
      IdTaller: cita.taller,
      estado: cita.estado,
      IdMecanico: cita.mecanico,
      fechaCita: cita.fechaCita,
      horaCita: cita.horaCita,
      servicio: cita.servicio,
    };

    citaAdapter
      .createCita(citaToCreate)
      .then((cita) => {
        return res.status(HttpStatus.OK).json(cita);
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    console.error("Error al crear cita ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const updateCita = (req: Request, res: Response) => {
  try {
    const IdCita = req.params.Id;
    const cita = req.body;
    citaAdapter
      .updateCitaByIdCita(IdCita, cita)
      .then((cita) => {
        if (cita) {
          return res.status(HttpStatus.ACCEPTED).json({
            message: "Se actualizo la cita " + IdCita + " correctamente",
          });
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ error: "No se actualizo la cita" });
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    console.error("Error al actualizar la cita ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const calificaCita = (req: Request, res: Response) => {
  try {
    const IdCita = req.params.Id;
    const { calificacion, calificacionUsuario } = req.body;
    citaAdapter
      .calificaCitaByIdCita({ IdCita, calificacion, calificacionUsuario })
      .then((result) => {
        if (result) {
          return res.status(HttpStatus.ACCEPTED).json({
            message: "Se actualizo la cita " + IdCita + " correctamente",
          });
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    console.error("Error al actualizar la cita ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const deleteCitaById = (req: Request, res: Response) => {
  try {
    const IdCita = req.params.Id;
    console.debug("Parametro de IdCita recibido :::::>", IdCita);
    citaAdapter
      .deleteById(IdCita)
      ?.then((result) => {
        if (result) {
          return res.status(HttpStatus.ACCEPTED).json({
            message: "Se elimino la IdCita " + IdCita + " correctamente",
          });
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ message: "Id no encontrado" });
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    console.error("Error al borrar Cita By Id ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const findCitaById = (req: Request, res: Response) => {
  try {
    const IdCita = req.params.Id;
    //console.debug('Parametro de Idusuario recibido :::::>', req.params);
    citaAdapter
      .findCitaByIdCita(IdCita)
      ?.then((cita) => {
        if (cita) {
          return res.status(HttpStatus.OK).json(cita);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    console.error("Error al buscar Cita By Id ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllCitasByIdTaller = (req: Request, res: Response) => {
  try {
    const IdTaller = req.params.Id;

    citaAdapter
      .getAllCitasByIdTaller(IdTaller)
      ?.then((citas) => {
        if (citas) {
          const events = castCitasToEvents(citas);
          res.status(HttpStatus.OK).json(events);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllCitasByIdUsuario = (req: Request, res: Response) => {
  try {
    const IdUsuario = req.params.Id;
    citaAdapter
      .getAllCitasByIdUsuario(IdUsuario)
      ?.then((citas) => {
        if (citas) {
          res.status(HttpStatus.OK).json(citas);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllCitasPasadasByIdUsuario = (req: Request, res: Response) => {
  try {
    const IdUsuario = req.params.Id;

    citaAdapter
      .getAllCitasPasadasByIdUsuario(IdUsuario)
      ?.then((citas) => {
        if (citas) {
          res.status(HttpStatus.OK).json(citas);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    console.error("Error al listar citas ::::> ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllCitasActivasByIdUsuario = (req: Request, res: Response) => {
  try {
    const IdUsuario = req.params.Id;

    citaAdapter
      .getAllCitasActivasByIdUsuario(IdUsuario)
      ?.then((citas) => {
        if (citas) {
          res.status(HttpStatus.OK).json(citas);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllCitasFuturasByIdUsuario = (req: Request, res: Response) => {
  try {
    const IdUsuario = req.params.Id;

    citaAdapter
      .getAllCitasFuturasByIdUsuario(IdUsuario)
      ?.then((citas) => {
        if (citas) {
          return res.status(HttpStatus.OK).json(citas);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    console.error("Error al listar citas ::::> ", error);
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const countCitasByIdTaller = (req: Request, res: Response) => {
  try {
    const IdTaller = req.params.Id;

    citaAdapter
      .countCitasByIdTaller(IdTaller)
      ?.then((result) => {
        if (result) {
          return res.status(HttpStatus.OK).json(result);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const countCitasByEstadoIdTaller = (req: Request, res: Response) => {
  try {
    const IdTaller = req.params.Id;

    citaAdapter.countCitasByEstadoIdTaller(IdTaller)?.then((result) => {
      if (result) {
        return res.status(HttpStatus.OK).json(result);
      } else {
        return res.status(HttpStatus.OK).json({});
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const countCitasByDateAndIdTaller = (req: Request, res: Response) => {
  try {
    const IdTaller = req.params.Id;

    citaAdapter
      .countCitasByDateAndIdTaller(IdTaller)
      ?.then((result) => {
        if (result) {
          return res.status(HttpStatus.OK).json(result);
        } else {
          return res.status(HttpStatus.OK).json({});
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getAllCitasByfilter = (req: Request, res: Response) => {
  try {
    let IdTaller = req.params.Id;
    let filter = req.body.value;

    citaAdapter
      .findCitaByFilter(
        { IdTaller: IdTaller, estado: { [Op.ne]: "Cancelada" } },
        {},
        { CodigoOrden: filter }
      )
      ?.then((citas) => {
        if (citas) {
          const events = castCitasToEvents(citas);
          return res.status(HttpStatus.OK).json(events);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

export default {
  getAllCitas,
  createCita,
  updateCita,
  deleteCitaById,
  findCitaById,
  getAllCitasByIdTaller,
  getAllCitasByIdUsuario,
  getAllCitasPasadasByIdUsuario,
  getAllCitasActivasByIdUsuario,
  getAllCitasFuturasByIdUsuario,
  getAllCitasByfilter,
  countCitasByIdTaller,
  countCitasByEstadoIdTaller,
  countCitasByDateAndIdTaller,
  calificaCita,
};
