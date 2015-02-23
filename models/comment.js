"use strict";
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    comment: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Comment;
};