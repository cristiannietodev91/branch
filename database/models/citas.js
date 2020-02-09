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
        }
    }, {});
    Cita.associate = function (models) {
        // associations can be defined here
        Cita.belongsTo(models.Taller, {
            foreignKey: 'IdTaller',
            target_id: 'IdTaller'
        });

        Cita.belongsTo(models.Vehiculo, {
            foreignKey: 'IdVehiculo',
            target_id: 'IdVehiculo'
        });
    };
    return Cita;
};