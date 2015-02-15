"use strict";

// User has:
// name, location, games, ratings, comments

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
  }, {
      classMethods: {
        associate: function(models) {
            User.hasMany(models.Game);
            User.hasMany(models.Rating);
            User.hasMany(models.Comment);
        }
      }
  });

  return User;
};