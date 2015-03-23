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
          Game.hasMany(models.Comment);
      }
    },
    instanceMethods: {
      averageRating: function() {
        var ratings = this.getRatings();
        if (ratings.count == 0)
          return 0;
        var sum = ratings.reduce(function (prev, cur, _, __) {
          return prev + cur.rating;
        }, 0);
        return sum / ratings.length;
      },
      hasUser: function(user) {
        var users = this.getUsers();
        return user.equalsOneOf(users);
      }
    }
  });
  return Game;
};
