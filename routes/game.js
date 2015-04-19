var express = require('express');
var router = express.Router();
var models = require('../models');

function addFiles(files, game, next) {
  if (files.length === 0)
    return next();

  var file = files.shift();
  file = {
    'path': file.path,
    'type': 'src'
  };

  models.File.create(file).then(function(file) {
    file.addGame(game);
    addFiles(files, game, next);
  });
}

function addCollaborators(users, game, next) {
  if (users.length === 0)
    return next();

  var user = users.shift();
  models.User.find({where: {username: user}}).then(function(user) {
    game.addUser(user);
    addCollaborators(users, game, next);
  });
}

function addTags(tags, game, next) {
  if (tags.length === 0)
    return next();

  var tag = tags.shift();
  models.Tag.findOrCreate({where: {tag: tag}}).spread(function(tag, created) {
    tag.addGame(game);
    addTags(tags, game, next);
  });
}

module.exports = function(passport) {
  /* GET game */
  router.get('/:id', function(req, res) {
    models.Game.find(req.param('id')).then(function(game) {
      res.json(game);
    })
  });

  /* POST game */
  router.post('/', passport.isAuthenticated, function(req, res) {
    // Validate visibility
    if (req.body.gameVisibility === 'neu' && !req.user.hasNEUEmail())
      return res.json({success: false, error: 'Not an NEU user'});

    console.log(req.body);

    var game = {
      name: req.body.name,
      shortDesc: req.body.shortdesc,
      longDesc: req.body.longdesc,
      visibility: req.body.visibility,
      GenreId: req.body.genre,
      PlatformId: req.body.platform,
      LicenseId: req.body.license,
    };

    console.log(game);

    models.Game.create(game).then(function(game) {
      // add tag relationships
      var tags = [];
      if (req.body.tags !== undefined) {
        tags = req.body.tags.split(" ");
      }
      addTags(tags, game, function() {
        // add self as collaborator
        game.addUser(req.user);
        // add other collaborators
        var users = [];
        if (req.body.users !== undefined) {
          users = req.body.users.split(" ");
        }
        addCollaborators(users, game, function () {
          // add uploaded file(s)
          addFiles(req.files.files, game, function () {
            res.json({success: true, gameId: game.get('id')});
          });
        });
      });
    });
  });

  /* PUT game */
  router.put('/:id', passport.isOwner, function(req, res) {
    req.game.updateAttributes({
      name: req.body.name,
      shortDesc: req.body.shortDesc,
      longDesc: req.body.longDesc,
      visibility: req.body.visibility
    }).success(function() {
      res.json({success: true})
    });
  });

  /* DELETE game */
  router.delete('/:id', passport.isOwner, function(req, res) {
    req.game.destroy().then(function() {
      res.json({success: true});
    });
  });

  /* POST comment to game */
  router.post('/:id/comment', passport.isAuthenticated, function (req, res) {
    models.Comment.create({
      comment: req.body.comment,
      date: Date.now(),
      GameId: req.body.gameId,
      UserId: req.user.id
    }).then(function() {
      res.json({success: true});
    });
  });

  /* POST rating to game */
  router.post('/:id/rating', passport.isAuthenticated, function (req, res) {
    models.Rating.create({
      rating: req.body.rating,
      date: Date.now(),
      GameId: req.body.gameId,
      UserId: req.user.id
    }).then(function() {
      res.json({success: true});
    });
  });

  /* POST user to game */
  router.post('/:id/collaborators', passport.isOwner, function (req, res) {
    req.game.addUser(req.user).then(function() {
      res.json({success: true});
    });
  });

  return router;
}
