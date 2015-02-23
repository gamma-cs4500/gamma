"use strict";
module.exports = function(sequelize, DataTypes) {
  var Rating = sequelize.define("Rating", {
    rating: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Rating;
};