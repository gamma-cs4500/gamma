var assert = require('assert');
var request = require('supertest');
var models = require('../models');
var app = require('../app.js');
var bcrypt = require('bcrypt');

// Namespace for LoginFlow tests
describe('LoginFlow', function () {
  this.timeout(5000);
  
  // Run this before each test in LoginFlow
  beforeEach(function (done) {
    // Create fake users
    models.sequelize.sync({force: true, logging: false})
        .then(function() {
            var salt = bcrypt.genSaltSync(10);
            var jamel = {username: 'jamel', password: bcrypt.hashSync('jamel', salt)};
            var basel = {username: 'basel', password: bcrypt.hashSync('basel', salt)};
            var ryan = {username: 'ryan', password: bcrypt.hashSync('ryan', salt)};
            models.User.bulkCreate([jamel, basel, ryan]);
        })
        .then(done);
  });

  describe('Login existing user', function() {
    it('Should successfully login', function(done) {
      request(app)
        .post('/api/login')
        .send({'username': 'jamel', 'password': 'jamel'})
        .expect(200, done);
    });
  });

  describe('Register existing user', function() {
      it('Should fail due to name conflict', function(done) {
          request(app)
            .post('/api/signup')
            .send({'username': 'jamel', 'password': 'jamel'})
            .expect(200)
            .expect({'success': false, 'message': 'User exists'}, done);
      });
  });

  // XXX: Need to figure out how to attach messages to 401
  describe('Login bad password', function() {
      it('Should fail since passwords dont match', function(done) {
          request(app)
            .post('/api/login')
            .send({'username': 'jamel', 'password': 'duhiforgot'})
            .expect(401, done);
            //.expect({'success': false, 'message': 'Invalid password'}, done);
      });
  });

    describe('Login bad username', function() {
      it('Should fail since username does not exist', function(done) {
          request(app)
            .post('/api/login')
            .send({'username': 'scott', 'password': 'doesntmatter'})
            .expect(401, done);
    });
  });

});

// Namespace for LogoutFlow tests
describe('LogoutFlow', function () {
  this.timeout(5000);
  
  // Run this before each test in LogoutFlow
  beforeEach(function (done) {
    // Create fake users
    models.sequelize.sync({force: true, logging: false})
        .then(function() {
            var jamel = {username: 'jamel', password: 'jamel'};
            var basel = {username: 'basel', password: 'basel'};
            var ryan = {username: 'ryan', password: 'ryan'};
            models.User.bulkCreate([jamel, basel, ryan]);
        })
        .then(done);
  });

  describe('Logout existing user', function() {
    it('Should successfully logout', function(done) {
      request(app)
        .post('/api/logout')
        .send({'username': 'jamel', 'password': 'jamel'})
        .expect(200, done);
    });
  });
});
