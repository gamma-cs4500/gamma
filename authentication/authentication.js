var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');

module.exports = function(passport) {
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    console.log('serializing user: ' + user);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    models.User.findOne(id).then(
      function(user) {
          console.log('deserializing user: ' + user);
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
              console.log('User Not Found with username ' + username);
              return done(null, false, {'message': 'Incorrect username'});
            }

            if (!isValidPassword(user, password)) {
              console.log('Invalid password');
              return done(null, false, {'message': 'Invalid password'});
            }

            return done(null, user);
          });
      })
  );

}
