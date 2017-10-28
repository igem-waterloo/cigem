var fs = require('fs');
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
  var { repo, name } = req.body;
  fs.readFile('./repoIndex.json', 'utf8', function readFileCallback(err, data) {
    console.log(repo);
    if (err) {
      console.log(err);
      res.send('Something went wrong :/');
      return;
    }
    var repoIndex = JSON.parse(data); //now it an object
    if (repoIndex[repo]) {
      res.send('Already set up');
    } else {
      Git.Clone(`${repo}`, "./repos")
      .then(function () {
        repoIndex[repo] = name;
        var json = JSON.stringify(repoIndex);
        fs.writeFile('./repoIndex.json', json, 'utf8', function writeFileCallback(err, data) {
          if (err) {
            console.log(err);
            res.send('Could not write to store');
            return;
          } else {
            res.send('All set up!');
          }
        });
      })
      .catch(function(err) {
        console.log(err);
        res.send('Could not clone the repo');
      });
    }
  });
});

module.exports = router;
