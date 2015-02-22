"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Games", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      uploadDate: {
        type: DataTypes.DATE
      },
      shortDesc: {
        type: DataTypes.STRING
      },
      longDesc: {
        type: DataTypes.STRING
      },
      visibility: {
        type: DataTypes.ENUM('private', 'public', 'neu')
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Games").done(done);
  }
};
