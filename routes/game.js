var express = require('express');
var router = express.Router();
var models = require('../models');

// should be in api endpoint. not necessarily in api.js file, but at /api/games/1 endpoint
var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  else
    return res.sendStatus(401);
}

var isOwner = function (req, res, next) {
  debugger;
  Game.find(req.param('id')).then(function (game) {

    if (req.user.id == game.getUser().id) {
      return next();
    } else {
      return res.sendStatus(401);
    }
  });
}



/* GET game */
router.get('/:id', function(req, res) {
  models.Game.find(req.param('id')).then(function(game) {
    res.json(game);
  })
});

/* POST game */
router.post('/', isAuthenticated, function(req, res) {
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
router.put('/:id', isAuthenticated, function(req, res) {
  models.Game.find(req.param('id')).then(function(game) {
    game.updateAttributes({
      name: req.body.name,
      shortDesc: req.body.shortDesc,
      longDesc: req.body.longDesc,
      visibility: req.body.visibility
    }).success(function() {
      res.json({success: true})
    });
  });
});

/* DELETE game */
router.delete('/:id', isOwner, function(req, res) {
  models.Game.find(req.param('id')).then(function(game) {
    game.destroy().then(function() {
      res.json({success: true});
    });
  }).catch(function(e) {
      res.json({success: false, message: "Unable to delete game"});
  });
});

module.exports = router;
