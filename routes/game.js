var express = require('express');
var router = express.Router();
var models = require('../models');



module.exports = function(passport) {
  /* GET game */
  router.get('/:id', function(req, res) {
    models.Game.find(req.param('id')).then(function(game) {
      console.log("cool");
      var similarGames = getSimilarGames(game);
      res.json(game);
    })
  });

  /* POST game */
  router.post('/', passport.isAuthenticated, function(req, res) {
    models.Game.create({
      name: req.body.name,
      shortDesc: req.body.shortDesc,
      longDesc: req.body.longDesc,
      visibility: req.body.gameVisibility,
      GenreId: req.body.gameGenre,
      PlatformId: req.body.gamePlatform,
      LicenseId: req.body.gameLicense,
    }).then(function(game) {
      // add tag relationships
      req.body.tags.split(" ").forEach(function(title) {
        models.Tag.findOrCreate({where: {tag: title}})
          .spread(function(tag, created) {
            tag.addGame(game);
          })
      });

      // add self as collaborator
      game.addUser(req.user);
      // add other users as collaborators
      req.body.users.split(" ").forEach(function(name) {
        models.User.find({where: {username: name}})
          .then(function(user) {
            game.addUser(user);
          })
      });

      res.json({success: true, gameId: game.get('id')});
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
