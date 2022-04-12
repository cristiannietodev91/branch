"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("cita", {
      IdCita: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      IdTaller: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'taller'
          },
          key: 'IdTaller'
        }
      },
      IdMecanico: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'mecanico'
          },
          key: 'IdMecanico'
        }
      },
      IdVehiculo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'vehiculo'
          },
          key: 'IdVehiculo'
        }
      },
      fechaCita: {
        type: Sequelize.DATEONLY,
      },
      horaCita: {
        type: Sequelize.TIME,
      },
      servicio: {
        type: Sequelize.STRING,
      },
      estado: {
        type: Sequelize.ENUM(
          "Solicitada",
          "Confirmada",
          "Cancelada",
          "Incumplida",
          "Cumplida",
          "Finalizada"
        ),
      },
      calificacion: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable("cita");
  },
};
