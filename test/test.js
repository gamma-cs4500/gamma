var assert = require('assert');
var models = require('../models');
var request = require('supertest');
var app = require('../app.js');

describe('LoginFlow', function () {
  beforeEach(function (done) {
    models.sequelize.sync({force: true}).then(function () {
      models.User.create({username: 'jamel', password: 'jamel'});
      models.User.create({username: 'basel', password: 'basel'});
      models.User.create({username: 'ryan', password: 'ryan'});
    });
  });

});
