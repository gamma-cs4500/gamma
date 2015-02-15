"use strict";

// Genre has:
// name

module.exports = function(sequelize, DataTypes) {
  var Genre = sequelize.define("Genre", {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        
      }
    }
  });

  return Genre;
};