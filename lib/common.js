var spawn = require('child_process').spawn;
var path = require('path');
var when = require('when');

var Paths = {
  CORDOVA: path.resolve(__dirname, '..', 'node_modules', '.bin', 'cordova')
};

function cordova(argv, options) {
  options = options || {};
  options = {
    env: process.env,
    cwd: options.cwd || process.cwd(),
    stdio: 'inherit'
  };

  return pSpawn(Paths.CORDOVA, argv, options);
}

function pSpawn(path, argv, options) {
  var deferred = when.defer();

  spawn(path, argv, options)
    .on('exit', function (code) {
      deferred.resolve(code);
    });

  return deferred.promise;
}

module.exports = {
  Paths: Paths,
  cordova: cordova,
  pSpawn: pSpawn
};
