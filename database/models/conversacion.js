"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Conversacion = sequelize.define("conversacion", {
    IdConversacion: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: Sequelize.STRING,
      allowNull: false
    },
    keyconversacion: {
      type: Sequelize.STRING,
      allowNull: true
    },
    IdTaller: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  });
  Conversacion.associate = function (models) {
    Conversacion.belongsTo(models.usuarios, {
      foreignKey: "uid",
      targetKey: "uid"
    });
    Conversacion.belongsTo(models.taller, {
      foreignKey: "IdTaller",
      target_id: "IdTaller"
    });
  };
  return Conversacion;
};
