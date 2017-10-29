var fs = require('fs');
var express = require('express');
var router = express.Router();
var Git = require("nodegit");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  if (req.headers['x-github-event'] !== 'push') {
    res.send('gotta be a push, man');
    return;
  }
  var repoUrl = req.body.repository.html_url;
  var repoName = repoUrl.split('/').slice(-2).join('/');
  fs.readFile('./repoIndex.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
      res.send('Something went wrong :/');
      return;
    }
    var repoIndex = JSON.parse(data); //now it an object
    if (!repoIndex[repoUrl]) {
      res.send('Repo isn\'t set up yet');
      return;
    } else {
      Git.Repository.open(`./repos/${repoName}`)
      .then(function(repo) {
        repository = repo;

        return repository.fetchAll({
          callbacks: {
            credentials: function(url, userName) {
              return Git.Cred.sshKeyFromAgent(userName);
            },
            certificateCheck: function() {
              return 1;
            }
          }
        });
      })
      // Now that we're finished fetching, go ahead and merge our local branch
      // with the new one
      .then(function() {
        return repository.mergeBranches("master", "origin/master");
      })
      .done(function() {
        res.send('Merged!');
        return;
      });
    }
  });
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
  var repoName = repo.split('/').slice(-2).join('/');
  fs.readFile('./repoIndex.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
      res.send('Something went wrong :/');
      return;
    }
    var repoIndex = JSON.parse(data); //now it an object
    if (repoIndex[repo]) {
      res.send('Already set up');
    } else {
      Git.Clone(`${repo}`, `./repos/${repoName}`)
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
