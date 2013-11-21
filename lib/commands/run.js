var common = require('../common');
var when = require('when');

function run(argv, options, loader) {
  argv = [
    options.device ? 'run' : 'emulate'
  ];

  if (options._.length) {
    argv.push(options._[0]);
  }

  return when.all([
    common.cordova(argv, {
      cwd: common.config().clientRoot
    }),
    // TODO(schoon) - What arguments should we pass to the server?
    common.npm(['start'], {
      cwd: common.config().serverRoot
    })
  ]);
}

module.exports = run;
