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
        Game.belongsToMany(models.User);
        Game.belongsToMany(models.Tag);
        Game.belongsToMany(models.File)
        Game.hasMany(models.Comment);
        Game.hasMany(models.Rating);
        Game.belongsTo(models.Genre);
        Game.belongsTo(models.Platform);
        Game.belongsTo(models.License);
      }
    },
    instanceMethods: {
      averageRating: function(cb) {
       this.getRatings().then(function(ratings) {
          if (ratings.length == 0)
            return cb(0);
          var sum = ratings.reduce(function (prev, cur, _, __) {
            return prev + Number.parseInt(cur.rating);
          }, 0);
          return cb(sum / ratings.length);
        });
      }
    }
  });
  return Game;
};
