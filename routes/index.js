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
        {'model': models.License},
        {'model': models.Tag},
        {'model': models.File}
      ]
    };
    models.Game.find(query).then(function(game) {
      // No such game
      if (game == null)
        res.redirect(301, '/');

      game.averageRating(function(averageRating) {
        game._averageRating = averageRating.toFixed(2);

        getSimilarGames(game.Tags.slice(), game, [], function (similarGames) {
          // filter out games that cannot be displayed
          similarGames = similarGames.filter(function(g) {
            return displayGame(g, req.user)
          });
          // add game zip
          addSource(game);

          var params = {
            'game': game,
            'user': req.user,
            'similarGames': similarGames
          };
          handleGameRequest(params, res);
        });
      });
    });
  });

  router.get('/search', function(req, res) {
    models.Game.findAll({where: {name: {like: '%' + req.query['q'] + '%'}}}).success(function(games) {
      games = games.filter(function(g) {return displayGame(g, req.user)});
      res.json(games);
    });
  });


  router.get('/login', function(req, res, next) {
    var params = {
      'user': req.user
    };
    res.render('login', params);
  });

  router.get('/self', function(req, res) {
    var params = {
      'user': req.user
    };
    res.render('user', params);
  });

  return router;
}

function getSimilarGames(tags, game, similarGames, next) {
  if (tags.length === 0) {
    // Filter out current game
    similarGames = similarGames.filter(function(g) {return g.id != game.id});
    // Filter out identical games
    result = [];
    ids = [];
    similarGames.forEach(function (g) {
      if (ids.indexOf(g.id) == -1) {
        result.push(g);
        ids.push(g.id);
      }
    });
    // only first 8 related games
    return next(result.slice(0, 8));
  }

  var tag = tags.shift();
  tag.getGames().then(function(games) {
    games.forEach(function(game) {
      if (similarGames.indexOf(game) == -1) {
        similarGames.push(game);
      }
    });
    getSimilarGames(tags, game, similarGames, next);
  });
}

function displayGame(game, user) {
  if (game.visibility === 'private') {
    return false;
  }

  else if (game.visibility === 'neu') {
    if (user === undefined || !user.hasNEUEmail())
      return false;
    else
      return true;
  }

  else {
    return true;
  }
}

function handleGameRequest(params, res) {
    // Private game
  if (params.game.visibility === 'private') {
    // Not logged in
    if (params.user === undefined)
      res.redirect(301, '/');
    // Not associated with game
    params.game.hasUser(params.user).then(function(hasUser) {
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

function addSource(game) {
  game._source = '#';
  if (game.Files !== undefined) {
    for (var i = 0; i < game.Files.length; i++) {
      var file = game.Files[i];
      if (file.type === 'src') {
        game._source = file.path.replace('public', '');
        break;
      }
    }
  }
}