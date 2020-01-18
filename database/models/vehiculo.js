'use strict';
const Sequelize = require('sequelize');
//TODO: Pendiente foreing key tabla vehiculo columna IdMarca
module.exports = (sequelize, DataTypes) => {
    const Vehiculo = sequelize.define('Vehiculo', {
        IdVehiculo: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        IdMarca: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        IdUsuario: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        IdTaller: {
            type: Sequelize.INTEGER
        },
        tipoVehiculo: {
            type: Sequelize.ENUM('Moto', 'Carro'),
            allowNull: false
        },
        placa: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        kilometraje: {
            type: Sequelize.INTEGER
        },
        modelo: {
            type: Sequelize.INTEGER
        },
        color: {
            type: Sequelize.STRING
        },
        fechaCompra: {
            type: Sequelize.DATEONLY
        },
        alias: {
            type: Sequelize.STRING
        },
        estado: {
            type: Sequelize.ENUM('Registrado', 'Pendiente'),
            allowNull: false
        }
    }, {});
    Vehiculo.associate = function (models) {
        // associations can be defined here
        Vehiculo.belongsTo(models.Marca, {
            foreignKey: 'IdMarca',
            target_id: 'IdMarca'
        });

        Vehiculo.belongsTo(models.Usuarios, {
            foreignKey: 'IdUsuario',
            target_id: 'IdUsuario'
        });

        Vehiculo.belongsTo(models.Taller, {
            foreignKey: 'IdTaller',
            target_id: 'IdTaller',
            as: 'taller'
        });

        Vehiculo.hasMany(models.Cita, {
            foreignKey: 'IdVehiculo',
            as: 'citas',
            onDelete: 'CASCADE',
        });
    };
    return Vehiculo;
};