var express = require('express');
var router = express.Router();

var options = {'root': './views/'};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', options);
});

router.get('/game', function(req, res, next) {
  res.sendFile('game-page.html', options);
});

router.get('/game/new', function(req, res, next) {
  res.sendFile('game-page.html', options);
});

router.get('/login', function(req, res, next) {
  res.sendFile('login.html', options);
});

module.exports = router;
