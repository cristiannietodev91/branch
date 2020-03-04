'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Cita = sequelize.define('cita', {
        IdCita: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        IdTaller: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        IdMecanico: {
            type: Sequelize.INTEGER
        },
        IdVehiculo: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        fechaCita: {
            type: Sequelize.DATEONLY
        },
        horaCita: {
            type: Sequelize.TIME
        },
        servicio: {
            type: Sequelize.STRING
        },
        estado: {
            type: Sequelize.ENUM('Solicitada','Confirmada','Cancelada','Incumplida','Cumplida')
        }
    }, {});
    Cita.associate = function (models) {
        // associations can be defined here
        Cita.belongsTo(models.taller, {
            foreignKey: 'IdTaller',
            target_id: 'IdTaller'
        });

        Cita.belongsTo(models.vehiculo, {
            foreignKey: 'IdVehiculo',
            target_id: 'IdVehiculo'
        });

        Cita.belongsTo(models.mecanico, {
            foreignKey: 'IdMecanico',
            target_id: 'IdMecanico'
        });
    };
    return Cita;
};