"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("marca", {
      IdMarca: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      marca: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      referencia: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categoria: {
        type: Sequelize.STRING(5),
      },
      tipo: {
        type: Sequelize.STRING,
      },
      descripcion: {
        type: Sequelize.STRING,
        // allowNull defaults to true
      },
      tipoVehiculo: {
        type: Sequelize.ENUM("Moto", "Carro"),
        // allowNull defaults to true
      },
      urllogo: {
        type: Sequelize.STRING,
        // allowNull defaults to true
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("marca");
  },
};
