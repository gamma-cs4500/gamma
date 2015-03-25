var express = require('express');
var router = express.Router();
var models = require('../models');

module.exports = function(passport) {
  /* GET game */
  router.get('/:id', function(req, res) {
    models.Game.find(req.param('id')).then(function(game) {
      res.json(game);
    })
  });

  /* POST game */
  router.post('/', passport.isAuthenticated, function(req, res) {
    models.Game.create({
      name: req.body.name,
      shortDesc: req.body.shortDesc,
      longDesc: req.body.longDesc,
      visibility: req.body.visibility
    }).then(function(game) {
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
  router.post('/:id/comment', passport.isOwner, function (req, res) {
    models.Comment.create({
      comment: req.body.comment,
      date: Date.now(),
      GameId: req.game.id,
      UserId: req.user.id
    }).then(function() {
      res.json({success: true});
    });
  });

  /* POST rating to game */
  router.post('/:id/rating', passport.isOwner, function (req, res) {
    models.Rating.create({
      rating: req.body.rating,
      date: Date.now().toString()
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
