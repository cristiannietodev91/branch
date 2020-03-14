'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('usuarios', {
    IdUsuario: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    identificacion: {
      type: Sequelize.STRING,
      unique: true
      // allowNull defaults to true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    uid: {
      type: Sequelize.STRING,
      allowNull: false
    },
    celular: {
      type: Sequelize.STRING
    },
    tipoUsuario: {
      type: Sequelize.ENUM('Cliente', 'AdminTaller'),
      allowNull: false
    },
    estado: {
      type: Sequelize.ENUM('Registrado', 'Pendiente'),
      allowNull: false
    },
    IdTaller: {
      type: Sequelize.INTEGER
    },
    tokenCM: {
      type: Sequelize.STRING
    }
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    
  };
  return User;
};