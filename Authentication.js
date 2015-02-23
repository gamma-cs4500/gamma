



  var models = require("./models");
  var sequelize = models.sequelize;
  var Users = models.Users;
  var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  
  /* add this to app file if not added
  
  app.use(passport.session());
  
  app.use(function(req, res, next){
  var err = req.session.error,
      messages = req.session.notice,
      success = req.session.success;
*/
  
  //Username, password
  passport.use(new LocalStrategy(
  function (username, password, done){
    var User = require('User').User;
    User.find({username: username}).success(function(user){
      //user enters username not found in database
      if (!user){
        return done(null, false, { message: 'Username not found'} );
      }
      //If user entered incorrect password
      if (user.password !== password){
        return done(null, false, { message: 'Incorrect password'} );
      }
      //Verify callback
      return done(null, { username: user.username });
    });
  }
));

//to login users
passport.use(new LocalStrategy(
  function(req, username, password, done) {
    var User = require('User').User;
    User.find({username: username}).success(function(user){
      if (user) {
        console.log("Welcome: " + user.username);
        req.session.success = 'You are successfully logged in';
        done(null, user);
      }
      if (!user) {
        req.session.error = 'Error. Please try again';
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));


//To register users
passport.use( new LocalStrategy(
  function(req, username, password, done) {
    var User = require('User').User;
    User.find({username: username}).success(function(user){
      if (user) {
        console.log(user.username + ":" + " Has been registered");
        req.session.success = 'Success';
        done(null, user);
      }
      if (!user) {
        req.session.error = 'Username in use. Try different username'
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));



Users.validPassword = function(password){
  return this.password === password;
}


//This to set the user as req.user and persist their session via a cookie.
Users.serializeUser = function(user, done){
  done(null, user);
};

Users.deserializeUser = function(obj, done){
  done(null, obj);
};