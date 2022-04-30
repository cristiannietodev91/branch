"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("mecanicotaller", {
      IdTaller: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "taller"
          },
          key: "IdTaller"
        },
      },
      IdMecanico: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "mecanico"
          },
          key: "IdMecanico"
        },
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable("mecanicotaller");
  },
};
