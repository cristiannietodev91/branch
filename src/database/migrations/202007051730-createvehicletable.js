"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("vehiculo", {
      IdVehiculo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      IdMarca: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "marca"
          },
          key: "IdMarca"
        }
      },
      IdUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "usuarios"
          },
          key: "IdUsuario"
        }
      },
      IdTaller: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "taller"
          },
          key: "IdTaller"
        }
      },
      tipoVehiculo: {
        type: Sequelize.ENUM("Moto", "Carro"),
        allowNull: false,
      },
      placa: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      kilometraje: {
        type: Sequelize.INTEGER,
      },
      modelo: {
        type: Sequelize.INTEGER,
      },
      color: {
        type: Sequelize.STRING,
      },
      fechaCompra: {
        type: Sequelize.DATEONLY,
      },
      alias: {
        type: Sequelize.STRING,
      },
      fotos: {
        type: Sequelize.JSON,
      },
      tarjetapropiedad: {
        type: Sequelize.JSON,
      },
      tecnomecanica: {
        type: Sequelize.JSON,
      },
      soat: {
        type: Sequelize.JSON,
      },
      fvtecnomecanica: {
        type: Sequelize.DATEONLY,
      },
      fvsoat: {
        type: Sequelize.DATEONLY,
      },
      estado: {
        type: Sequelize.ENUM("Registrado", "Pendiente"),
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
    return queryInterface.dropTable("vehiculo");
  },
};
