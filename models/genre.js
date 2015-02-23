"use strict";
module.exports = function(sequelize, DataTypes) {
  var Genre = sequelize.define("Genre", {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Genre;
};