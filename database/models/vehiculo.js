"use strict";
const Sequelize = require("sequelize");
const sequelizePaginate = require("sequelize-paginate");
//TODO: Pendiente foreing key tabla vehiculo columna IdMarca
module.exports = (sequelize, DataTypes) => {
  const Vehiculo = sequelize.define(
    "vehiculo",
    {
      IdVehiculo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      IdMarca: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      IdUsuario: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      IdTaller: {
        type: Sequelize.INTEGER,
      },
      tipoVehiculo: {
        type: Sequelize.ENUM("Moto", "Carro"),
        allowNull: false,
      },
      placa: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      kilometraje: {
        type: Sequelize.INTEGER,
      },
      modelo: {
        type: Sequelize.INTEGER,
      },
      color: {
        type: Sequelize.STRING,
      },
      fechaCompra: {
        type: Sequelize.DATEONLY,
      },
      alias: {
        type: Sequelize.STRING,
      },
      fotos: {
        type: Sequelize.JSON,
      },
      tarjetapropiedad: {
        type: Sequelize.JSON,
      },
      tecnomecanica: {
        type: Sequelize.JSON,
      },
      soat: {
        type: Sequelize.JSON,
      },
      fvtecnomecanica: {
        type: Sequelize.DATEONLY,
      },
      fvsoat: {
        type: Sequelize.DATEONLY,
      },
      estado: {
        type: Sequelize.ENUM("Registrado", "Pendiente"),
        allowNull: false,
      },
    },
    {}
  );
  Vehiculo.associate = function (models) {
    // associations can be defined here
    Vehiculo.belongsTo(models.marca, {
      foreignKey: "IdMarca",
      target_id: "IdMarca",
    });

    Vehiculo.belongsTo(models.taller, {
      foreignKey: "IdTaller",
      target_id: "IdTaller",
    });

    Vehiculo.hasMany(models.cita, {
      foreignKey: "IdVehiculo",
      as: "citas",
      onDelete: "CASCADE",
    });

    Vehiculo.belongsTo(models.usuarios, {
      foreignKey: "IdUsuario",
      targetKey: "uid",
      target_id: "uid",
    });
  };
  sequelizePaginate.paginate(Vehiculo);
  return Vehiculo;
};
