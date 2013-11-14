var common = require('../common');

function run(argv, options, loader) {
  argv = [
    options.device ? 'run' : 'emulate'
  ];

  if (options._.length) {
    argv.push(options._[0]);
  }

  return common.cordova(argv, {
    cwd: common.config().clientRoot
  });
}

module.exports = run;
