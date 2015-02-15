"use strict";

// Comment has:
// user_id, game_id, comment, Date

module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    comment: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        
      }
    }
  });

  return Comment;
};