"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("etapa", {
      IdEtapa: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      NombreEtapa: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requiereDocumentos: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      requiereAprobacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable("etapa");
  },
};
