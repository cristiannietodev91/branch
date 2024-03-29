import http from "../http-common";

class ServiceCrm {
  createSession(idToken, uid) {
    return http.post("/session/login", { idToken, uid });
  }

  closeSession() {
    return http.post("/session/logout");
  }

  registrarUsuario(usuario) {
    return http.post("/session/createUser", usuario);
  }

  getAllTalleres() {
    return http.get("/taller/getAll");
  }

  createTaller(taller) {
    return http.post("/taller/create", taller);
  }

  updateTaller(taller) {
    return http.put("/taller/update/" + taller.IdTaller, taller);
  }

  getTallerById(IdTaller) {
    return http.get("/taller/getById/" + IdTaller);
  }

  getOrdenById(IdOrden) {
    return http.get("/orden/getById/" + IdOrden);
  }

  getAllMecanicos(IdTaller) {
    return http.get("/mecanico/getAllByIdTaller/" + IdTaller);
  }

  createMecanico(mecanico) {
    return http.post("/mecanico/create", mecanico);
  }

  updateMecanico(mecanico) {
    return http.put("/mecanico/update/" + mecanico.IdMecanico, mecanico);
  }

  deleteMecanico(IdMecanico) {
    return http.delete("/mecanico/deleteById/" + IdMecanico);
  }

  getVehiculosByIdTaller(IdTaller) {
    return http.get("/vehiculo/getByIdTaller/" + IdTaller);
  }

  getPaginateVehiculosByIdTaller(
    IdTaller,
    page,
    perPage,
    columnFilter,
    filter
  ) {
    return http.get("/vehiculo/getPaginateByIdTaller/" + IdTaller, {
      params: {
        page: page,
        perPage: perPage,
        columnFilter: columnFilter,
        filter: filter
      }
    });
  }

  createVehiculo(vehiculo) {
    return http.post("/vehiculo/create", vehiculo);
  }

  createCita(cita) {
    return http.post("/cita/create", cita);
  }

  updateCita(cita) {
    return http.put("/cita/update/" + cita.IdCita, cita);
  }

  calificaCita(IdCita, calificacion) {
    return http.put("/cita/calificar/" + IdCita, {
      calificacion: calificacion
    });
  }

  createOrden(orden) {
    return http.post("/orden/create", orden);
  }

  getCitasByIdTaller(IdTaller) {
    return http.get("/cita/getByIdTaller/" + IdTaller);
  }

  getOrdenesByIdTaller(IdTaller) {
    return http.get("/orden/getByIdTaller/" + IdTaller);
  }

  getOrdenesByIdTallerAndFilter(IdTaller, filter) {
    return http.get("/orden/getByIdTallerAndFilter/" + IdTaller, {
      params: {
        filter: filter
      }
    });
  }

  getOrdenesByIdTallerAndIdCita(IdTaller, IdCita) {
    return http.get("/orden/getByIdTallerAndIdCita/" + IdTaller, {
      params: {
        IdCita: IdCita
      }
    });
  }

  getMessagesByConversacion(IdConversacionUser, IdTaller) {
    return http.get("/message/getMessagesByConversacion", {
      params: {
        IdConversacionUser: IdConversacionUser,
        IdTaller: IdTaller,
        order: "ASC"
      }
    });
  }

  getConversacionesUnReadByTaller(IdTaller) {
    return http.get("/message/getConversacionUnread/" + IdTaller);
  }

  markReadMessagesConversacion(conversacion) {
    return http.put("/message/updatereadAllMessages", conversacion);
  }

  getConversacionesByTaller(IdTaller, firstName) {
    return http.get("/conversacion/getAllByIdTaller/" + IdTaller, {
      params: {
        firstName: firstName
      }
    });
  }

  countUnReadMessagesByIdConversacion(IdConversacion, typeusuario) {
    return http.get("/message/countByIdConversacion/" + IdConversacion, {
      params: {
        typeusuario: typeusuario
      }
    });
  }

  countVehiculosByTaller(IdTaller) {
    return http.get("/vehiculo/countByIdTaller/" + IdTaller);
  }

  countClientesByTaller(IdTaller) {
    return http.get("/usuario/countByIdTaller/" + IdTaller);
  }

  countCitasByTaller(IdTaller) {
    return http.get("/cita/countByIdTaller/" + IdTaller);
  }

  countCitasByTallerAndDate(IdTaller) {
    return http.get("/cita/countByDate/" + IdTaller);
  }

  countCitasByTallerAndEstado(IdTaller) {
    return http.get("/cita/countByEstado/" + IdTaller);
  }

  countOrdenesByTaller(IdTaller) {
    return http.get("/orden/countByIdTaller/" + IdTaller);
  }
}

export default new ServiceCrm();
