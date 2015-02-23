

//NOTE : Routes in our app.js file has to point to functions in this file

var user = require('../models/User');


var passport = require('passport');
var Controller = {
    
    
    
   
        
        loginFailure: function(req, res){
            res.json({
                success: false,
                message: 'Invalid username or password.'
            });
        },
        
        logout: function(req, res){
            req.logout();
            res.end();
        }
        
        
     
    
}