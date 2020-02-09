'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const MecanicoTaller = sequelize.define('mecanicotaller', {
    IdTaller: {
      type: DataTypes.INTEGER,
      references: {
        model: 'taller'
      }
    },
    IdMecanico: {
      type: DataTypes.INTEGER,
      references: {
        model: 'mecanico'
      }
    }
    

  }, {});
  MecanicoTaller.associate = function (models) {
    models.taller.belongsToMany(models.mecanico, {
      through: MecanicoTaller,
      foreignKey: 'IdTaller'
    });
    // associations can be defined here
    models.mecanico.belongsToMany(models.taller, {
      through: MecanicoTaller,
      foreignKey: 'IdMecanico'
    });

    

    
  };
  return MecanicoTaller;
};