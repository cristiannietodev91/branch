"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "notificacion",
          "dataAdicional",
          {
            type: Sequelize.DataTypes.JSON
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "cita",
          "calificacionUsuario",
          {
            type: Sequelize.DataTypes.INTEGER
          },
          { transaction: t }
        )
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("notificacion", "dataAdicional", {
          transaction: t
        }),
        queryInterface.removeColumn("cita", "calificacionUsuario", {
          transaction: t
        })
      ]);
    });
  }
};
