'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Mecanico = sequelize.define('mecanico', {
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
        },
        fullName: {
            type: DataTypes.VIRTUAL,
            get() {
              return `${this.firstName} ${this.lastName}`;
            },
            set(value) {
              throw new Error('Do not try to set the `fullName` value!');
            }
          }
    }, {});
    Mecanico.associate = function (models) {
        // associations can be defined here
        
    };
    return Mecanico;
};