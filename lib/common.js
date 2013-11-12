var spawn = require('child_process').spawn;
var path = require('path');
var sf = require('slice-file');
var when = require('when');

var Paths = {
  CORDOVA: path.resolve(__dirname, '..', 'node_modules', '.bin', 'cordova'),
  BOWER: path.resolve(__dirname, '..', 'node_modules', '.bin', 'bower')
};

function pSpawn(path, argv, options) {
  var deferred = when.defer();

  options = options || {};
  options = {
    env: process.env,
    cwd: options.cwd || process.cwd(),
    stdio: 'inherit'
  };

  spawn(path, argv, options)
    .on('error', function (err) {
      deferred.reject(err);
    })
    .on('exit', function (code) {
      deferred.resolve(code);
    });

  return deferred.promise;
}

function cordova(argv, options) {
  return pSpawn(Paths.CORDOVA, argv, options);
}

function yeoman(argv, options) {
  var env = require('yeoman-generator')();

  options = options || {};

  env.cwd = options.cwd || process.cwd();
  env.registerStub(require('./generators/marionette'), 'marionette');
  env.run(argv);
}

function bower(argv, options) {
  return pSpawn(Paths.BOWER, argv, options);
}

function tail(filename, options) {
  var deferred = when.defer();
  var stream = sf(path.resolve(process.cwd(), filename));

  options = options || {};

  var index = -1 * (options.length || 10);

  if (options.follow) {
    stream = stream.follow(index);
  } else {
    stream = stream.slice(index);
  }

  stream.pipe(process.stdout);
  stream.on('end', function () {
    deferred.resolve();
  });

  return deferred.promise;
}

module.exports = {
  Paths: Paths,
  pSpawn: pSpawn,
  cordova: cordova,
  yeoman: yeoman,
  bower: bower,
  tail: tail
};
