"use strict";
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    comment: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Comment.belongsTo(models.Game);
        Comment.belongsTo(models.User);
      }
    }
  });
  return Comment;
};
