"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const ServicioVehiculo = sequelize.define(
    "serviciovehiculo",
    {
      IdServicio: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      IdVehiculo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      servicio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      valor: {
        type: Sequelize.REAL,
        allowNull: false,
        unique: true,
      },
    },
    {}
  );
  ServicioVehiculo.associate = function (models) {
    ServicioVehiculo.belongsTo(models.vehiculo, {
      foreignKey: "IdVehiculo",
      target_id: "IdVehiculo",
    });
  };
  return ServicioVehiculo;
};
