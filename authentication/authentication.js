var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');

module.exports = function(passport){

  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
      console.log('serializing user: ');console.log(user);
      done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          console.log('deserializing user:',user);
          done(err, user);
      });
  });

  function isValidPassword(user, password) {
    return true;
  }

  passport.use('login', new LocalStrategy({
          passReqToCallback : true
      },
      function(req, username, password, done) {
          models.User.find({ where: {'username': username} }).then(function(user) {
            if (!user) {
              console.log('User Not Found with username ' + username);
              return done(null, false, req.flash('message', 'User not found'));
            }

            if (!isValidPassword(user, password)) {
              console.log('Invalid password');
              return done(null, false, req.flash('message', 'Invalid password'));
            }

            return done(null, user);
          });
      })
  );


  passport.use('signup', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
      models.User
        .findOrCreate({where: {username: username},
                               defaults: {password: password}})
        .spread(function(user, created) {
          if (!created) {
            return done(null, false, req.flash('message', 'Error in user creation'));
          }
          return done(null, user);
       })
    })
  );
}
