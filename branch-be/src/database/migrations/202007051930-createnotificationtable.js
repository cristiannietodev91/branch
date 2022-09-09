"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("notificacion", {
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
        type: Sequelize.STRING,
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
    return queryInterface.dropTable("notificacion");
  }
};
