const vehiculoDAO = require("../dao/vehiculoDAO");
const marcaDAO = require("../dao/marcaDAO");
let sms = require("../utils/sendSms");

const crearVehiculo = (userRecord, vehiculo, cb) => {
  if (vehiculo.marca) {
    marcaDAO.findOneByFilter(
      { marca: vehiculo.marca.marca, referencia: vehiculo.marca.referencia },
      (error, marca) => {
        if (error) {
          cb(error, null);
        } else {
          if (marca) {
            var vehiculoRegister = {
              IdMarca: marca.IdMarca,
              IdUsuario: userRecord.uid,
              IdTaller: vehiculo.IdTaller,
              tipoVehiculo: "Moto",
              placa: vehiculo.placa,
              estado: "Pendiente",
              alias: vehiculo.alias,
              color: vehiculo.color,
              fechaCompra: vehiculo.fechaCompra,
              kilometraje: vehiculo.kilometraje,
              modelo: vehiculo.modelo,
              fotos: vehiculo.fotos
            };
            vehiculoDAO.create(vehiculoRegister, function (error, vehiculo) {
              if (error) {
                cb(error, null);
              } else {
                if (vehiculo) {
                  //Send SMS al usuario al que pertenece el vehiculo para que ingrese a administrar el vehiculo
                  /*if (userRecord.celular) {
                                    var textoSms = "Se ha registrado el vehiculo " + vehiculo.placa + " por el taller BRANCH lo invitamos a que se registre en el siguiente link para que disfrute los beneficios BRANCH http://localhost:8080";
                                    sms.sendSMStoInfoBip(userRecord.celular, textoSms);
                                }*/
                  cb(null, vehiculo);
                } else {
                  cb({ error: "No se creo el vehiculo" }, null);
                }
              }
            });
          } else {
            cb(
              { error: "No se encontro una marca para registrar el vehiculo" },
              null
            );
          }
        }
      }
    );
  } else {
    let vehiculoRegister = {
      IdMarca: 1,
      IdUsuario: userRecord.uid,
      IdTaller: vehiculo.IdTaller,
      tipoVehiculo: "Moto",
      placa: vehiculo.placa,
      estado: "Pendiente",
      alias: vehiculo.alias,
      color: vehiculo.color,
      fechaCompra: vehiculo.fechaCompra,
      kilometraje: vehiculo.kilometraje,
      modelo: vehiculo.modelo,
      fotos: vehiculo.fotos
    };
    vehiculoDAO.create(vehiculoRegister, function (error, vehiculo) {
      if (error) {
        cb(error, null);
      } else {
        if (vehiculo) {
          //Send SMS al usuario al que pertenece el vehiculo para que ingrese a administrar el vehiculo
          if (userRecord.celular) {
            var textoSms =
              "Se ha registrado el vehiculo " +
              vehiculo.placa +
              " por el taller BRANCH lo invitamos a que se registre en el siguiente link para que disfrute los beneficios BRANCH http://localhost:8080";
            sms.sendSMStoInfoBip(userRecord.celular, textoSms);
          }
          cb(null, vehiculo);
        } else {
          cb({ error: "No se creo el vehiculo" }, null);
        }
      }
    });
  }
};

module.exports = {
  crearVehiculo
};
