"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    IdMessage: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    _id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    IdConversacion: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    text: {
      type: Sequelize.STRING,
      allowNull: true
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    IdCita: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    delivered: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    read: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    typeusuario: {
      type: Sequelize.STRING,
      allowNull: false
    },
    user: {
      type: Sequelize.JSON,
      allowNull: false
    },
    IdEtapa: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    IdOrdenTrabajo: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  });
  Message.associate = function (models) {
    Message.belongsTo(models.conversacion, {
      foreignKey: "IdConversacion",
      target_id: "IdConversacion"
    });
  };
  return Message;
};
