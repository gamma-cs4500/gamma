var express = require('express');
var router = express.Router();
var models = require('../models');
var bcrypt = require('bcrypt');


var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  else
    return res.sendStatus(401);
}

var genHashSalt = function (req, res, next) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      next(hash);
    });
  });
}

module.exports = function(passport) {
  router.post('/login', passport.authenticate('login'), function(req, res) {
    res.json({ success: true });
  });

  router.post('/logout', function(req, res){
    req.logout();
    res.json({ success: true });
  });

  /* Handle Registration POST */
  router.post('/signup', function(req, res) {
    genHashSalt(req, res, function (hash) {
      models.User.findOrCreate({
          where: {username: req.body.username},
          defaults: {username: req.body.username, password: hash}
        }).spread(function(user, created) {
          if (!created) {
            res.json({
                success: false,
                message: 'User exists'
            });
          } else {
              req.login(user, function (err) {
                if (err) throw err;
                res.json({ success: true });
            });
          }
        });
    });
  });

  router.get('/self', isAuthenticated, function(req, res) {
      res.json({ user: req.user });
  });

  router.put('/self', isAuthenticated, function(req, res) {
    genHashSalt(req, res, function(hash) {
      if (req.body.password == "" || req.body.password == null) {
        res.json({success: false});
      } else {
        req.user.updateAttributes({
          username: req.body.username,
          password: hash
        }).success(function() {
          res.json({success: true});
        });
      }
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

  return router;
}
