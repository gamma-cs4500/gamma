var express = require('express');
var router = express.Router();
var models = require("../models");

module.exports = function(passport) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    // Get a list of games to render
    res.render('index');
  });

  router.get('/game/new', passport.loginRequired, function(req, res, next) {
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

  router.get('/game/:id', function(req, res, next) {
    models.Game.find(req.params.id).then(function(game) {
      var user = req.user;
      var params = {
        'game': game, 
        'user': user
      };

      if (game == null)
        res.redirect(301, '/');

      if (game.visibility == 'private') {
        console.log(user);
        console.log(game.hasUser(user));
        if (!game.hasUser(user))
          res.redirect(301, '/');
      }
      else if (game.visibility == 'neu') {
        if (!user.hasNEUEmail())
          res.redirect(301, '/');
      }

      res.render('game-page', params);
    });
  });

  router.get('/login', function(req, res, next) {
    res.render('login');
  });

  return router;
}
