import http from "../http-common";

class ServiceCrm {
  
  getAllTalleres() {
    return http.get("/taller/getAll");
  }

  createTaller(taller) {
    return http.post("/taller/create",taller);
  }

  getTallerById(IdTaller){
    return http.get("/taller/getById/"+IdTaller);
  }

  createMecanico(mecanico) {
    return http.post("/mecanico/create",mecanico);
  }

  getVehiculosByIdTaller(IdTaller){
    return http.get("/vehiculo/getByIdTaller/"+IdTaller);
  }

  createVehiculo(vehiculo) {
    return http.post("/vehiculo/create",vehiculo);
  }

  createCita(cita) {
    return http.post("/cita/create",cita);
  }
  
  getCitasByIdTaller(IdTaller){
    return http.get("/cita/getByIdTaller/"+IdTaller);
  }


  getAllTipificacionesTel() {
    return http.get(`/tipificacion/getAllTipificacionesTel`);
  }

  getAllTipificacionesContacto() {
    return http.get(`/tipificacion/getAllTipificacionesContacto`);
  }

  tipificarTelefono(telefonoGestion) {
    return http.post("/gestionTelefono/createGestion", telefonoGestion);
  }

  tipificarContacto(telefonoContacto) {
    return http.post("/gestionContacto/createGestion", telefonoContacto);
  }

  update(id, data) {
    return http.put(`/tutorials/${id}`, data);
  }

  delete(id) {
    return http.delete(`/tutorials/${id}`);
  }

  deleteAll() {
    return http.delete(`/tutorials`);
  }

  findByTitle(title) {
    return http.get(`/tutorials?title=${title}`);
  }
}

export default new ServiceCrm();
