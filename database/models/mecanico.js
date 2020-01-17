'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Mecanico = sequelize.define('Mecanico', {
        IdMecanico: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        identificacion: {
          type: Sequelize.STRING,
          allowNull: false
        },        
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING
            // allowNull defaults to true
        },
        skills: {
            type: Sequelize.JSON
        },
        costos: {
            type: Sequelize.JSON
        }
    }, {});
    Mecanico.associate = function (models) {
        // associations can be defined here
        Mecanico.belongsToMany(models.Taller, {
            through: 'MecanicoTaller',
            as: 'Talleres',
            foreignKey: 'IdMecanico'
        });
    };
    return Mecanico;
};