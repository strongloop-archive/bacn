var lib = require('../');
var common = lib('common');
var config = lib('config');

function run(argv, options, loader) {
  argv = [
    options.device ? 'run' : 'emulate'
  ];

  if (options._.length) {
    argv.push(options._[0]);
  }

  common.cordova(argv);
}

module.exports = run;
