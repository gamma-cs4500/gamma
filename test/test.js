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

            var genres = [{'name': 'Arcade'}, {'name': 'Shooter'}, {'name': 'Puzzle'}];
            var licenses = [{'type': 'BSD'}, {'name': 'GPL'}, {'name': 'MIT'}];
            var platforms = [{'type': 'Desktop', 'name': 'PC'}];

            models.Genre.bulkCreate(genres);
            models.License.bulkCreate(licenses);
            models.Platform.bulkCreate(platforms);
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
            var salt = bcrypt.genSaltSync(10);
            var jamel = {username: 'jamel', password: bcrypt.hashSync('jamel', salt)};
            var basel = {username: 'basel', password: bcrypt.hashSync('basel', salt)};
            var ryan = {username: 'ryan', password: bcrypt.hashSync('ryan', salt)};
            models.User.bulkCreate([jamel, basel, ryan]);

            var genres = [{'name': 'Arcade'}, {'name': 'Shooter'}, {'name': 'Puzzle'}];
            var licenses = [{'type': 'BSD'}, {'name': 'GPL'}, {'name': 'MIT'}];
            var platforms = [{'type': 'Desktop', 'name': 'PC'}];

            models.Genre.bulkCreate(genres);
            models.License.bulkCreate(licenses);
            models.Platform.bulkCreate(platforms);
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

// New Game Creation Tests
describe('NewGame', function () {
  this.timeout(5000);
  
  // Run this before each test in NewGame
  beforeEach(function (done) {
    // Create fake users
    models.sequelize.sync({force: true, logging: false})
        .then(function() {
            var salt = bcrypt.genSaltSync(10);
            var jamel = {username: 'jamel', password: bcrypt.hashSync('jamel', salt)};
            var basel = {username: 'basel', password: bcrypt.hashSync('basel', salt)};
            var ryan = {username: 'ryan', password: bcrypt.hashSync('ryan', salt)};
            models.User.bulkCreate([jamel, basel, ryan]);

            var genres = [{'name': 'Arcade'}, {'name': 'Shooter'}, {'name': 'Puzzle'}];
            var licenses = [{'type': 'BSD'}, {'name': 'GPL'}, {'name': 'MIT'}];
            var platforms = [{'type': 'Desktop', 'name': 'PC'}];

            models.Genre.bulkCreate(genres);
            models.License.bulkCreate(licenses);
            models.Platform.bulkCreate(platforms);
        })
        .then(done);
  });

  describe('Create new private game', function() {
    it('Should successfully create new private game', function(done) {
      request(app)
        .post('/api/game/')
        .send({'name': 'Hardcore', 'shortDesc': 'its Hardcore', 'longDesc': 'its so very Hardocre',
         'visibility': 'private', 'GenreId': '5', 'PlatformId': '1', 'LicenseId': '1'})
        .expect(304, done); // Must figure out proper way to catch a redirect in order to test success
    });
  });
});

// Rating Tests
describe('Rating', function () {
  this.timeout(5000);
  
  // Run this before each test in Rating
  beforeEach(function (done) {
    // Create fake users
    models.sequelize.sync({force: true, logging: false})
        .then(function() {
            var salt = bcrypt.genSaltSync(10);
            var jamel = {username: 'jamel', password: bcrypt.hashSync('jamel', salt)};
            var basel = {username: 'basel', password: bcrypt.hashSync('basel', salt)};
            var ryan = {username: 'ryan', password: bcrypt.hashSync('ryan', salt)};
            models.User.bulkCreate([jamel, basel, ryan]);

            var genres = [{'name': 'Arcade'}, {'name': 'Shooter'}, {'name': 'Puzzle'}];
            var licenses = [{'type': 'BSD'}, {'name': 'GPL'}, {'name': 'MIT'}];
            var platforms = [{'type': 'Desktop', 'name': 'PC'}];

            models.Genre.bulkCreate(genres);
            models.License.bulkCreate(licenses);
            models.Platform.bulkCreate(platforms);
            var game1 = {name: 'hardcore', shortDesc: 'its hardcore', longDesc: 'very hardcore',
            visibility: 'private', GenreId: '1', PlatformId: '1', LicenseId: '1'};
            models.Game.bulkCreate([game1]);

        })
        .then(done);
      });

  describe('Give rating to game', function() {
    it ('Should successfully add new rating to game', function(done) {
      request(app)
      .post('/api/game/1/rating')
      .send({'rating': '5', 'GameId': '1', 'UserId': '1'})
      .expect(200, done);
    });
  });

  describe('Change game rating', function() {
    it ('Should successfully add new rating to game', function(done) {
      request(app)
      // Figure out how to extract rating from database prior to user rating it
      .post('/api/game/1/rating')
      .send({'rating': '5', 'GameId': '1', 'UserId': '1'})
      .expect(200, done);
      // Figure out how to extract rating from database user last entry.
    });
  });

  describe('Rating a game twice', function() {
    it ('Should fail to add new rating to game', function(done) {
      // Figure out how to extract rating from database prior to user rating it
      request(app)
      .post('/api/game/1/rating')
      .send({'rating': '5', 'GameId': '1', 'UserId': '1'})
      .expect(200, done);
      // Figure out how to extract rating from database user last entry.
    });
  });
});

// Commenting Tests
describe('Commenting', function () {
  this.timeout(5000);
  
  // Run this before each test in Commenting
  beforeEach(function (done) {
    // Create fake users
    models.sequelize.sync({force: true, logging: false})
        .then(function() {
            var salt = bcrypt.genSaltSync(10);
            var jamel = {username: 'jamel', password: bcrypt.hashSync('jamel', salt)};
            var basel = {username: 'basel', password: bcrypt.hashSync('basel', salt)};
            var ryan = {username: 'ryan', password: bcrypt.hashSync('ryan', salt)};
            models.User.bulkCreate([jamel, basel, ryan]);

            var genres = [{'name': 'Arcade'}, {'name': 'Shooter'}, {'name': 'Puzzle'}];
            var licenses = [{'type': 'BSD'}, {'name': 'GPL'}, {'name': 'MIT'}];
            var platforms = [{'type': 'Desktop', 'name': 'PC'}];

            models.Genre.bulkCreate(genres);
            models.License.bulkCreate(licenses);
            models.Platform.bulkCreate(platforms);
            var game1 = {name: 'hardcore', shortDesc: 'its hardcore', longDesc: 'very hardcore',
            visibility: 'private', GenreId: '1', PlatformId: '1', LicenseId: '1'};
            models.Game.bulkCreate([game1]);

        })
        .then(done);
      });

  describe('Add a comment', function() {
    it ('Should successfully add new rating to game', function(done) {
      request(app)
      // Figure out how to extract rating from database prior to user rating it
      .post('/api/game/1/comment')
      .send({'comment': 'nice game', 'GameId': '1', 'UserId': '1'})
      .expect(200, done);
      // Figure out how to extract rating from database user last entry.
    });
  });
});

//Adding Collaborator
