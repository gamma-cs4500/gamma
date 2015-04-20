"use strict";
module.exports = function(sequelize, DataTypes) {
  var File = sequelize.define("File", {
    type: DataTypes.ENUM('exec', 'doc', 'src'),
    path: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        File.belongsToMany(models.Game);
      }
    }
  });
  return File;
};
