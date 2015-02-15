"use strict";

// Tag has:
// game_id, tag

module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define("Tag", {
    tag: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        
      }
    }
  });

  return Tag;
};