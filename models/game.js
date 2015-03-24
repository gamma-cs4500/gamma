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
        Game.belongsTo(models.Genre);
        Game.belongsTo(models.Platform);
        Game.belongsTo(models.License);
      }
    },
    instanceMethods: {
      averageRating: function() {
        var ratings = this.getRatings();
        if (ratings.count == 0)
          return 0;
        var sum = ratings.reduce(function (prev, cur, _, __) {
          return prev + Number.parseInt(cur.rating);
        }, 0);
        return sum / ratings.length;
      }
    }
  });
  return Game;
};
