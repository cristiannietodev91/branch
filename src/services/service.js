import http from "../http-common";

class ServiceCrm {

  registrarUsuario(usuario) {
    return http.post("/usuario/createFireBaseUser",usuario);
  }

  loginUserTaller(uid) {
    return http.get("/usuario/loginUsuario/"+uid);
  }

  getAllTalleres() {
    return http.get("/taller/getAll");
  }

  createTaller(taller) {
    return http.post("/taller/create", taller);
  }

  getTallerById(IdTaller) {
    return http.get("/taller/getById/" + IdTaller);
  }

  getOrdenById(IdOrden){
    return http.get("/orden/getById/"+IdOrden)
  }

  createMecanico(mecanico) {
    return http.post("/mecanico/create", mecanico);
  }

  getVehiculosByIdTaller(IdTaller) {
    return http.get("/vehiculo/getByIdTaller/" + IdTaller);
  }

  getPaginateVehiculosByIdTaller(IdTaller,page,perPage,columnFilter,filter) {
    return http.get("/vehiculo/getPaginateByIdTaller/" + IdTaller,{
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
    return http.put("/cita/update/"+cita.IdCita, cita);
  }

  createOrden(orden) {
    return http.post("/orden/create", orden);
  }

  getCitasByIdTaller(IdTaller) {
    console.log(`Buscar citas IdTaller :::> ${IdTaller}`)
    return http.get("/cita/getByIdTaller/" + IdTaller);
  }
  
  getOrdenesByIdTaller(IdTaller) {
    return http.get("/orden/getByIdTaller/" + IdTaller);
  }

}

export default new ServiceCrm();
