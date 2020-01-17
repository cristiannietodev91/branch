'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const MecanicoTaller = sequelize.define('MecanicoTaller', {
    
  }, {});
  MecanicoTaller.associate = function(models) {
    // associations can be defined here
  };
  return MecanicoTaller;
};