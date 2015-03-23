"use strict";
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Game);
        User.hasMany(models.Rating);
        User.hasMany(models.Comment);
      }
    },
    instanceMethods: {
      hasNEUEmail: function() {
        return this.username.match(/.neu.edu$/) !== null;
      }
    }
  });
  return User;
};
