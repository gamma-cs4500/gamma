"use strict";
module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define("Tag", {
    tag: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Tag.hasMany(models.Game);
      }
    }
  });
  return Tag;
};
