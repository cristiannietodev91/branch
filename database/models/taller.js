'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Taller = sequelize.define('Taller', {
        IdTaller: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        identificacion: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        direccion: {
            type: Sequelize.STRING,
            allowNull: false
        },
        latitude: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            validate: { min: -90, max: 90 }
        },
        longitud: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            validate: { min: -180, max: 180 }
        },
        celular: {
            type: Sequelize.STRING,
            allowNull: false
        },
        telefono: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        logo: {
            type: Sequelize.STRING
        },
        estado: {
            type: Sequelize.ENUM('Registrado', 'Pendiente'),
            allowNull: false
        }
    }, {});
    Taller.associate = function (models) {
        // associations can be defined here
        Taller.hasMany(models.Vehiculo, {
            foreignKey: 'IdTaller',
            as: 'vehiculos',
            onDelete: 'CASCADE',
        });

        Taller.hasMany(models.cita, {
            foreignKey: 'IdCita',
            as: 'citas',
            onDelete: 'CASCADE',
        });

       
    };
    return Taller;
};