var lib = require('../');
var common = lib('common');
var config = lib('config');

function create(argv, options, loader) {
  common.cordova(['create'].concat(argv));
}

module.exports = create;
