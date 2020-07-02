"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Orden = sequelize.define(
    "ordentrabajo",
    {
      IdOrdenTrabajo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      IdTaller: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      CodigoOrden: {
        type: Sequelize.STRING,
        allowNull: false
      },
      IdEtapa: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      IdCita: {
        type: Sequelize.INTEGER
      },
      IdMecanico: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      IdVehiculo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      kilometraje: {
        type: Sequelize.INTEGER
      },
      DocumentosDeja: {
        type: Sequelize.JSON
      },
      Observaciones: {
        type: Sequelize.STRING
      },
      documentos: {
        type: Sequelize.JSON
      },
      estado: {
        type: Sequelize.ENUM("Aceptado", "Pendiente", "Rechazado", "Inactivo"),
        allowNull: false
      }
    },
    {}
  );
  Orden.associate = function (models) {
    // associations can be defined here
    Orden.belongsTo(models.taller, {
      foreignKey: "IdTaller",
      target_id: "IdTaller"
    });

    Orden.belongsTo(models.vehiculo, {
      foreignKey: "IdVehiculo",
      target_id: "IdVehiculo"
    });

    Orden.belongsTo(models.mecanico, {
      foreignKey: "IdMecanico",
      target_id: "IdMecanico"
    });

    Orden.belongsTo(models.cita, {
      foreignKey: "IdCita",
      target_id: "IdCita",
      as: "cita"
    });

    Orden.belongsTo(models.etapa, {
      foreignKey: "IdEtapa",
      target_id: "IdEtapa"
    });
  };
  return Orden;
};
