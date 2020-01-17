'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Marca = sequelize.define('Marca', {
    IdMarca: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    marca: {
      type: Sequelize.STRING,
      allowNull: false
    },
    referencia: {
      type: Sequelize.STRING,
      allowNull: false
    },
    categoria: {
      type: Sequelize.STRING(1)
    },
    tipo: {
      type: Sequelize.STRING
    },
    descripcion: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    tipoVehiculo: {
      type: Sequelize.ENUM('Moto', 'Carro')
      // allowNull defaults to true
    }
  }, {});
  Marca.associate = function (models) {
    // associations can be defined here
  };
  return Marca;
};