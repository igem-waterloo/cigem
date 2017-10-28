var express = require('express');
var router = express.Router();
var Git = require("nodegit");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/setup', function(req, res, next) {
  if (!req.body.name || !req.body.repo) {
    res.send('Please include a \'name\' and \'repo\'');
    return;
  } else if (!req.body.repo.startsWith('https://github.com/')) {
    res.send('repo must be a github repo (https://github.com/*)');
    return;
  }
  Git.Clone(`${repo}`, "./repos")
  .then(console.log('lol'));
  res.send(req.body.blah);
});

module.exports = router;
