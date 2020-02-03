'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const MecanicoTaller = sequelize.define('MecanicoTaller', {
    IdTaller: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Taller'
      }
    },
    IdMecanico: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Mecanico'
      }
    }
    

  }, {});
  MecanicoTaller.associate = function (models) {
    models.Taller.belongsToMany(models.Mecanico, {
      through: MecanicoTaller,
      foreignKey: 'IdTaller'
    });
    // associations can be defined here
    models.Mecanico.belongsToMany(models.Taller, {
      through: MecanicoTaller,
      foreignKey: 'IdMecanico'
    });

    

    
  };
  return MecanicoTaller;
};