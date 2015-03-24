"use strict";
module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define("Tag", {
    tag: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Tag.belongsToMany(models.Game);
      }
    }
  });
  return Tag;
};
