var common = require('../common');

function build(argv, options, loader) {
  return common.cordova(['build'].concat(options._), {
    cwd: common.config().clientRoot
  });
}

module.exports = build;
