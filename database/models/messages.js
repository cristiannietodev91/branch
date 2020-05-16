"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    IdMessage: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    IdConversacion: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    text: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cita: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    delivered: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    read: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    typeusuario: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    idusuario: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nombreusuario: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  Message.associate = function (models) {};
  return Message;
};
