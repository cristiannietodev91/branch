"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("usuarios", {
      IdUsuario: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        // allowNull defaults to true
      },
      identificacion: {
        type: Sequelize.STRING,
        unique: true,
        // allowNull defaults to true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      uid: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      celular: {
        type: Sequelize.STRING,
      },
      tipoUsuario: {
        type: Sequelize.ENUM("Cliente", "AdminTaller"),
        allowNull: false,
      },
      estado: {
        type: Sequelize.ENUM("Registrado", "Pendiente"),
        allowNull: false,
      },
      IdTaller: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "taller",
          },
          key: "IdTaller",
        },
      },
      tokenCM: {
        type: Sequelize.STRING,
      },
      typeDevice: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("usuarios");
  },
};
