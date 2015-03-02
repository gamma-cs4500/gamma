var assert = require('assert');
var request = require('supertest');
var models = require('../models');
var app = require('../app.js');

// Namespace for LoginFlow tests
describe('LoginFlow', function () {
  
  // Run this before each test in LoginFlow
  beforeEach(function (done) {
    // Create fake users
    models.sequelize.sync({force: true}).then(function () {
      models.User.create({username: 'jamel', password: 'jamel'});
      models.User.create({username: 'basel', password: 'basel'});
      models.User.create({username: 'ryan', password: 'ryan'});
      done();
    });
  });

  describe('Login existing user', function() {
    it('Should successfully login', function(done) {
      request(app)
        .post('/api/login')
        .send({'username': 'jamel', 'password': 'jamel'})
        .expect(200);

      done();
    });
  });

});
