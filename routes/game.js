var express = require('express');
var router = express.Router();
var models = require('../models');

// should be in api endpoint. not necessarily in api.js file, but at /api/games/1 endpoint

/* GET game */
router.get('/:id', function(req, res) {
  models.Game.find(req.param('id')).then(function(game) {
    res.json(game);
  })
});

/* POST game */
router.post('/', function(req, res) {
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
router.put('/:id', function(req, res) {
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
router.delete('/:id', function(req, res) {
  models.Game.find(req.param('id')).then(function(game) {
    game.destroy().then(function() {
      res.json({success: true});
    });
  }).catch(function(e) {
      res.json({success: false, message: "Unable to delete game"});
  });
});

module.exports = router;
