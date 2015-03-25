var express = require('express');
var router = express.Router();
var models = require("../models");

module.exports = function(passport) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    var params = {
      'user': req.user
    };
    res.render('index', params);
  });

  router.get('/game/new', passport.loginRequired, function(req, res, next) {
    models.License.findAll().then(function(licenses) {
      models.Genre.findAll().then(function(genres) {
        models.Platform.findAll().then(function(platforms) {
          var params = {
            'licenses': licenses,
            'genres': genres,
            'platforms': platforms,
            'user': req.user
          };
          res.render('new-game', params);
        });
      });
    });
  });

  router.get('/game/:id', function(req, res, next) {
    var query = {
      'where': {'id': req.params.id},
      'include': [
        {'model': models.User},
        {'model': models.Comment, 'include': [models.User]},
        {'model': models.Rating},
        {'model': models.Genre},
        {'model': models.Platform},
        {'model': models.License}
      ]
    };
    models.Game.find(query).then(function(game) {
      game.averageRating(function(averageRating) {
        game._averageRating = averageRating.toFixed(2);
        // No such game
        if (game == null)
          res.redirect(301, '/');

        var params = {
          'game': game,
          'user': req.user
        };

        handleGameRequest(params, res);
      });
    });
  });


  router.get('/login', function(req, res, next) {
    var params = {
      'user': req.user
    };
    res.render('login', params);
  });

  return router;
}

function handleGameRequest(params, res) {
    // Private game
  if (params.game.visibility === 'private') {
    // Not logged in
    if (params.user === undefined)
      res.redirect(301, '/');
    // Not associated with game
    params.game.hasUser(user).then(function(hasUser) {
      if(!hasUser)
        res.redirect(301, '/');
      else
        res.render('game-page', params);
    });
  }

  // NEU-Only game
  else if (params.game.visibility === 'neu') {
    // Not logged in or not NEU student
    if (params.user === undefined || !params.user.hasNEUEmail())
      res.redirect(301, '/');
    else
      res.render('game-page', params);
  }

  // Public game
  else {
    res.render('game-page', params);
  }
}
