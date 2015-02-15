"use strict";

// Game has:
// Name, Date, Short Description, Long Description, Users, Tags, 
// Files, Ratings, Visibility, License, Genre, Platform

module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define("Game", {
    name: DataTypes.STRING,
    uploadDate: DataTypes.DATE,
    shortDesc: DataTypes.STRING,
    longDesc: DataTypes.STRING,
    visiblity: DataTypes.ENUM("private", "public", "neu")
  }, {
    classMethods: {
      associate: function(models) {
          Game.hasMany(models.User);
          Game.hasMany(models.Tag);
          Game.hasMany(models.File);
          Game.hasMany(models.Rating);
          Game.hasOne(models.License);
          Game.hasMany(models.Genre);
          Game.hasMany(models.Platform);
      }
    }
  });

  return Game;
};