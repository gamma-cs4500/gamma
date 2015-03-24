var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');
var bcrypt = require('bcrypt');

module.exports = function(passport) {
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    models.User.findOne(id).then(
      function(user) {
          done(null, user);
      },
      function(err) { throw err; }
    );
  });

  passport.use('login', new LocalStrategy({passReqToCallback : true}, function(req, username, password, done) {
    models.User.find({ where: {'username': username} }).then(function(user) {
      if (!user) {
        return done(null, false, {'message': 'Incorrect username'});
      }

      bcrypt.compare(password, user.password, function(err, res) {
        isValidPassword = res;

        if (!isValidPassword) {
          return done(null, false, {'message': 'Invalid password'});
        } else {
          return done(null, user);
        }
      });
    });
  }));


  // Vicious response, for the API
  passport.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    else
      return res.sendStatus(401);
  }

  // A gentler redirect, for the users
  passport.loginRequired = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    else
      return res.redirect('/login');
  }

  // Vicious response, for the API
  passport.isOwner = function (req, res, next) {
    if (req.user === undefined)
      return res.sendStatus(401);

    models.Game.find(req.param('id')).then(function (game) {
      if (game === null)
        return res.sendStatus(401);

      game.hasUser(req.user).then(function(hasUser) {
        if (hasUser) {
          req.game = game;
          return next();
        } else {
          return res.sendStatus(401);
        }
      });
    });
  }
}
