var spawn = require('child_process').spawn;
var path = require('path');

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

  return spawn(Paths.CORDOVA, argv, options);
}

module.exports = {
  Paths: Paths,
  cordova: cordova
};
