'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Cita = sequelize.define('Cita', {
        IdCita: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        IdTaller: {
            type: Sequelize.INTEGER,
            allowNull: false
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
            foreignKey: 'fk_idtallercitar',
            targetKey: 'IdTaller',
            as: 'taller'
        });
        Cita.belongsTo(models.Vehiculo, {
            foreignKey: 'fk_idvehiculocita',
            targetKey: 'IdVehiculo',
            as: 'vehiculo'
        });
    };
    return Cita;
};