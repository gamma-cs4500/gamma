var express = require('express');
var router = express.Router();
var models = require("../models");

/* GET home page. */
router.get('/', function(req, res, next) {
  // Get a list of games to render
  res.render('index');
});

router.get('/game', function(req, res, next) {
  res.render('game-page');
});

router.get('/game/new', function(req, res, next) {
  models.License.findAll().then(function(licenses) {
    models.Genre.findAll().then(function(genres) {
      models.Platform.findAll().then(function(platforms) {
        var params = {
          'licenses': licenses,
          'genres': genres,
          'platforms': platforms
        };
        res.render('new-game', params);
      });
    });
  });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

module.exports = router;
