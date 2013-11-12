var path = require('path');
var lib = require('../');
var common = lib('common');
var config = lib('config');

function log(argv, options, loader) {
  var tailArgs = [];

  // TODO(schoon) - Platform options.
  return common.tail(logpath('ios'), {
    follow: options.follow || options.f || false
  });
}

function logpath(platform) {
  return path.resolve(process.cwd(), 'platforms', platform, 'cordova', 'console.log');
}

module.exports = log;
