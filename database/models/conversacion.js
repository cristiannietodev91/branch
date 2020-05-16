"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Conversacion = sequelize.define("conversacion", {
    IdConversacion: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idusuario: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    keyconversacion: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    idtaller: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });
  Conversacion.associate = function (models) {};
  return Conversacion;
};
