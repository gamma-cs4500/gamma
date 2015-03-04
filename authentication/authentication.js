var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');

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

  function isValidPassword(user, password) {
    return user.password === password;
  }

  passport.use('login', new LocalStrategy({
          passReqToCallback : true
      },
      function(req, username, password, done) {
          models.User.find({ where: {'username': username} }).then(function(user) {
            if (!user) {
              return done(null, false, {'message': 'Incorrect username'});
            }

            if (!isValidPassword(user, password)) {
              return done(null, false, {'message': 'Invalid password'});
            }

            return done(null, user);
          });
      })
  );

}
