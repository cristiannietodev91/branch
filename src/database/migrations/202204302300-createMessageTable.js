"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("message", {
      IdMessage: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      _id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      IdConversacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "conversacion"
          },
          key: "IdConversacion"
        }
      },
      text: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      IdCita: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: "cita"
          },
          key: "IdCita"
        }
      },
      delivered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      typeusuario: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      IdEtapa: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: "etapa"
          },
          key: "IdEtapa"
        }
      },
      IdOrdenTrabajo: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: "ordentrabajo"
          },
          key: "IdOrdenTrabajo"
        }
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
    return queryInterface.dropTable("message");
  },
};
