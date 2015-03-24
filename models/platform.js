"use strict";
module.exports = function(sequelize, DataTypes) {
  var Platform = sequelize.define("Platform", {
    type: DataTypes.ENUM('desktop', 'mobile', 'console'),
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Platform.belongsToMany(models.Game);
      }
    }
  });
  return Platform;
};
