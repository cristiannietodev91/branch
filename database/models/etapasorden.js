"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Etapa = sequelize.define(
    "etapa",
    {
      IdEtapa: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      NombreEtapa: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requiereDocumentos: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      requiereAprobacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  Etapa.associate = function (models) {};
  return Etapa;
};
