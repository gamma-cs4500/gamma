var express = require('express');
var router = express.Router();
var models = require('../models');
var bcrypt = require('bcrypt');

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
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        password_hash = hash;

        models.User.findOrCreate({
          where: {username: req.body.username},
          defaults: {username: req.body.username, password: password_hash}
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
  });

  router.get('/self', passport.isAuthenticated, function(req, res) {
    res.json({ user: req.user });
  });

  return router;
}
