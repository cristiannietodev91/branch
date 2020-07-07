"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Notificacion = sequelize.define("notificacion", {
    IdNotificacion: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    IdUsuario: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    typenotificacion: {
      type: Sequelize.STRING,
      allowNull: true
    },
    read: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    dataAdicional: {
      type: Sequelize.JSON,
      allowNull: true
    }
  });
  Notificacion.associate = function (models) {
    Notificacion.belongsTo(models.usuarios, {
      foreignKey: "IdUsuario",
      targetKey: "uid",
      target_id: "uid"
    });
  };
  return Notificacion;
};
