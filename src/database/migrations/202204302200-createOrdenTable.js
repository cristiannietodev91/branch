"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ordentrabajo", {
      IdOrdenTrabajo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      IdTaller: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "taller"
          },
          key: "IdTaller"
        }
      },
      CodigoOrden: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      IdEtapa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "etapa"
          },
          key: "IdEtapa"
        }
      },
      IdCita: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "cita"
          },
          key: "IdCita"
        }
      },
      IdMecanico: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "mecanico"
          },
          key: "IdMecanico"
        }
      },
      IdVehiculo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "vehiculo"
          },
          key: "IdVehiculo"
        }
      },
      kilometraje: {
        type: Sequelize.INTEGER,
      },
      DocumentosDeja: {
        type: Sequelize.JSON,
      },
      Observaciones: {
        type: Sequelize.STRING,
      },
      documentos: {
        type: Sequelize.JSON,
      },
      estado: {
        type: Sequelize.ENUM("Aceptado", "Pendiente", "Rechazado", "Inactivo"),
        allowNull: false,
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
  down: (queryInterface) => {
    return queryInterface.dropTable("ordentrabajo");
  },
};
