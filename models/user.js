"use strict";
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {type: DataTypes.STRING, unique: true},
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Game, {'through': 'GamesUsers'});
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
