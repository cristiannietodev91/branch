"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("mecanico", {
      IdMecanico: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      identificacion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        // allowNull defaults to true
      },
      skills: {
        type: Sequelize.JSON,
      },
      costos: {
        type: Sequelize.JSON,
      },
      estado: {
        type: Sequelize.ENUM("Activo", "Eliminado"),
        allowNull: false,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("mecanico");
  },
};
