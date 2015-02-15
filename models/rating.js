"use strict";

// Rating has:
// user_id, game_id, comment, Date

module.exports = function(sequelize, DataTypes) {
  var Rating = sequelize.define("Rating", {
    rating: DataTypes.INTEGER,
    date: DataTypes.DATE,
  }, {
    classMethods: {
      associate: function(models) {
        
      }
    }
  });

  return Rating;
};