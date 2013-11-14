var path = require('path');
var common = require('../common');

function log(argv, options, loader) {
  var tailArgs = [];

  // TODO(schoon) - Platform options.
  return common.tail(logpath('ios'), {
    follow: options.follow || options.f || false
  });
}

function logpath(platform) {
  return path.resolve(common.config().clientRoot, 'platforms', platform, 'cordova', 'console.log');
}

module.exports = log;
