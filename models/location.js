"use strict";

// Location has:
// city, state

// XXX: International?

module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define("Location", {
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        
      }
    }
  });

  return Location;
};