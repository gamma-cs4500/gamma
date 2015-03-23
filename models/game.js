"use strict";
module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define("Game", {
    name: DataTypes.STRING,
    uploadDate: DataTypes.DATE,
    shortDesc: DataTypes.STRING,
    longDesc: DataTypes.STRING,
    visibility: DataTypes.ENUM('private', 'public', 'neu')
  }, {
    classMethods: {
      associate: function(models) {
          Game.hasMany(models.User);
          Game.hasMany(models.Tag);
          Game.hasMany(models.File);
          Game.hasMany(models.Rating);
      }
    }
  });
  return Game;
};
