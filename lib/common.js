var spawn = require('child_process').spawn;
var path = require('path');

var Paths = {
  CORDOVA: path.resolve(__dirname, '..', 'node_modules', '.bin', 'cordova')
};

function cordova(argv) {
  return spawn(
    Paths.CORDOVA,
    argv,
    {
      env: process.env,
      cwd: process.cwd(),
      stdio: 'inherit'
    }
  );
}

module.exports = {
  Paths: Paths,
  cordova: cordova
};
