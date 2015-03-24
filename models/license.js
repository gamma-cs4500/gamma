"use strict";
module.exports = function(sequelize, DataTypes) {
  var License = sequelize.define("License", {
    type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        License.belongsToMany(models.Game);
      }
    }
  });
  return License;
};
