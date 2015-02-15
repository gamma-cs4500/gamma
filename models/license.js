"use strict";

// License has:
// game_id, type

module.exports = function(sequelize, DataTypes) {
  var License = sequelize.define("License", {
    type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        
      }
    }
  });

  return License;
};