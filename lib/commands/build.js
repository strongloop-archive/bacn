var lib = require('../');
var common = lib('common');
var config = lib('config');

function build(argv, options, loader) {
  return common.cordova(['build'].concat(options._));
}

module.exports = build;
